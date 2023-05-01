import express, { Application } from 'express';
import connect_db from './utils';
import { createLogger, transports, format, Logger } from "winston";
import router from './routes/main.router';
import SwaggerUi from 'swagger-ui-express';
import SwaggerJs from 'swagger-jsdoc'
import SwaggerConf from "../swagger.configuration"
var logger:Logger =  createLogger({
    transports: [new transports.Console()],
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
  });
export function LogError(error:any){
    logger.error(error)
}

export default class App{

    public app: Application;
    private specs = SwaggerJs(SwaggerConf)
    constructor(private port:number, test:boolean=false){
        this.app = express();
        this.configure(test);
        this.routes();
        this.listen();
    }
    
    configure = async (test:boolean) =>{
      this.app.use(express.json()); //Hace parce del body para que sea un json
      await connect_db(test);
    } 
    
    routes = () =>{
      this.app.use('/docs/', SwaggerUi.serve, SwaggerUi.setup(this.specs))
      this.app.use('/api/',router)
      
    }

    async listen (){
        await this.app.listen(this.port)
        logger.info("listening app at http://localhost:" +this.port)
    }

}