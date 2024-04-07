const { Op } = require("sequelize");
const Models = require("../models");
const productAttributes = require('../attributes/products');
const attachmentAttributes = require("../attributes/attachment")




const calculatePrice = async( productId ) => {
  try{        
      let product = await Models.Product.findOne( { [Op.or]: { uuid: productId, id: productId } , raw:true, nest: true} );
      let discount =  product.discount ? product.discount : 0;
      let specialDiscount = product.specialDiscount ? product.specialDiscount : 0;
      let totalDiscount = discount+specialDiscount;
      let productPrice = product.marketPrice - (product.marketPrice * totalDiscount /100);
      return productPrice; 
   } catch( error ) {
      throw error.toString();
  }
}

module.exports = {
   
calculatePrice : calculatePrice,

validateProduct : async(requestedProductId, mainLanguage, defaultLanguage) =>{
    try {        
        const  innerWhere = { languageId: mainLanguage }
        let include = [
            {
              attributes:[ ...productAttributes.productContentAttributes ],
              required: false,
              model: Models.ProductContent,
              where: innerWhere,
              as:"mainContent"
            }, {
              attributes:[ ...productAttributes.productContentAttributes],
              required: true,
              model: Models.ProductContent,
              where: { languageId: defaultLanguage },
              as:"defaultContent"
            }, {
              required: true,
              model: Models.Attachment,
              attributes: [...attachmentAttributes.includeAttachmentAttributes]
            },
            {
              required: true,
              model: Models.Category,
              include: [{
                  attributes:["name"],
                  required: false,
                  model: Models.CategoryContent,
                  where: { languageId: mainLanguage },
                  as:"mainContent"
                }, {
                  attributes:["name"],
                  required: true,
                  model: Models.CategoryContent,
                  where: { languageId: defaultLanguage },
                  as:"defaultContent"
                },
                {
                    model: Models.Attachment,
                    attributes: [...attachmentAttributes.includeAttachmentAttributes]
                }
          ]}

          ];
        
          let options = {
            attributes:[...productAttributes.productAttributes],
            include,
            where:{
                [Op.or]:{
                    uuid: requestedProductId,
                    id: requestedProductId
                },
                isLive: true
            },
            raw: true,
            nest: true
          };

        let product = await Models.Product.findOne(options);
        if(!product){
            return false
        }
        let item = {
            "id" : product.id,
            "uuid": product.uuid,
            "isLive": product.isLive,
            "categoryId": product.categoryId,
            "price":  await calculatePrice( product.id ),
            "stock": product.stock,
            "dimantions": product.dimantions,
            "varientProperties": product.varientProperties,
            "properties": product.properties,
            "ratings": product.ratings,
            "isSpecial": product.isSpecial,
            "isOffer": product.isOffer,
            "discount": product.discount,
            "specialDiscount": product.specialDiscount,
            "marketPrice": product.marketPrice,
            "deliveryCharges": product.deliveryCharges,
            "sold": product.sold,
            "createdAt": product.createdAt,
            "updatedAt": product.updatedAt
        }
        let content = {
            "name": product.mainContent.name ? product.mainContent.name : product.defaultContent.name,
            "discription": product.mainContent.discription ? product.mainContent.discription : product.defaultContent.discription,
            "discriptionHtml": product.mainContent.discriptionHtml ? product.mainContent.discriptionHtml : product.defaultContent.discriptionHtml,
            "definition": product.mainContent.definition ? product.mainContent.definition : product.defaultContent.definition
        }
        let category = {
            name: product.Category.mainContent.name ? product.Category.mainContent.name : product.Category.defaultContent.name,
            uuid: product.Category.uuid,
            attachment: product.Category.attachment ,
            image : product.Category.Attachment.path ?process.env.ATTACHMENT_URL + product.Category.Attachment.path : null ,
            mimeType : product.Category.Attachment.mimeType ? product.Category.Attachment.mimeType : null,
            extension : product.Category.Attachment.extension ? product.Category.Attachment.extension : null
        }
        
        let finalProduct = { ...item, ... content, category }
        finalProduct.image = product.Attachment.path ? process.env.ATTACHMENT_URL + product.Attachment.path : null;
        finalProduct.mimeType = product.Attachment.mimeType ? product.Attachment.mimeType : null;
        finalProduct.extension = product.Attachment.extension ? product.Attachment.extension : null;        
        return finalProduct;
    } catch(err) {
        console.log("error in order:validateProduct", err)
    }
}

}