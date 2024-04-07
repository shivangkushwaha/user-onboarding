const setEnv = (env) =>{
    try{
        console.info(`Settting Enviorment :- ${env}`);
        env = env.toLowerCase();
        let enviormentVar = require(`./${env}.js`);
        if(enviormentVar){
            const keys = Object.keys(enviormentVar);
            keys.forEach(key => {
            process.env[key] = enviormentVar[key];
            });
        }
        else {
            process.exit(1);
        }
    } catch (error) {
        console.error("Error in Setting Enviorment Variable", error)
        process.exit(1);
    }
}


setEnv(process.env.NODE_ENV || 'local');