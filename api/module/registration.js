class Registration {
    constructor() {
        /* Initlize Contractor with the simple  data which we need to use in the fuction*/
    }

    /**
     * Function to register a user with the help of email and password
     * @returns 
     */
    async registerByEmailPassword(){
        try{

        } catch(error){
            console.log("Error occured while trying to register user with the  email and password: ", error);
            return {success:false, data:{}}
        }
    }
    
}