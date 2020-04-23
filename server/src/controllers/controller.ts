import { Request, Response } from 'express';
import { DBService } from '../services/db.service';
import joi from '@hapi/joi';

export class ContactController {

    constructor() {}

    public async getContacts(req: Request, res: Response) {
        try {
            const dbService = new DBService();
            const contacts = await dbService.getContacts();
            res.status(200).json(contacts);

        } catch (ex) {
            console.error(ex)
            res.status(500).json({ message: ex })
        }
    }

    public async addContact(req: Request, res: Response) {
        try {
            const schema = joi.object().keys({
                name: joi.string().required(),
                telephone: joi.string().required(),
            });

            const result = schema.validate({"name":req.body.name , "telephone":req.body.telephone});

            if (result.error) {  
                throw result.error.message;
            }

            const dbService = new DBService();
            let picture = req.body.picture;
            if (picture === '') {
                picture = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRQ8xzdv564ewROcTBYDdv51oTD5SgNOCDDwMw4XXIdvxFGyQzn';
            }
            await dbService.addContact(picture , req.body);
            res.status(201).json({message:"OK"});

        } catch (ex) {
            console.error(ex)
            res.status(500).json({ message: ex })
        }
    }

    public async deleteContact(req: Request, res: Response) {
        try {
            const schema = joi.object().keys({
                idList: joi.array().min(1)
            });

            const result = schema.validate(req.body);

            if (result.error) {  
                throw result.error.message;
            }

            const dbService = new DBService();
            for (let id of req.body.idList) {
                await dbService.deleteContact(id);
            }
            res.status(200).json({message:"OK"});
        } catch (ex) {
            console.error(ex)
            res.status(500).json({ message: ex })
        }
    }

    public async setContact(req: Request, res: Response) {
        try {
            const schema = joi.object().keys({
                id: joi.string().required(),
                picture: joi.string().required(),
                name: joi.string().required(),
                roles: joi.array().required(),
                telephone: joi.string().required(),
                isActive: joi.boolean().required()
            });

            const result = schema.validate(req.body);

            if (result.error) {  
                throw result.error.message;
            }
            
            const dbService = new DBService();
            await dbService.setContact(req.body);
            res.status(200).json({ message: "OK" });
        } catch (ex) {
            console.error(ex)
            res.status(500).json({ message: ex })
        }
    }

}