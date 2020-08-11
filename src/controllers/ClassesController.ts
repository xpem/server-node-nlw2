import { Request, Response } from 'express'

import db from '../database/connection';
import convertHourToMinute from '../Utils/convertHourtoMinutes';


interface schenduleItem {
    week_day: number;
    sc_from: string;
    sc_to: string;
}



export default class ClassesController {
    async index(req: Request, res: Response) {

     
        const filters = req.query;
        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if (!filters.subject || !filters.week_day || !filters.time) {
            return res.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = convertHourToMinute(time);
        const classes = await db('classes')
        .whereExists(function(){
            this.select('class_schendule.*').from('class_schendule')
            .whereRaw('`class_schendule`.`class_id` = `classes`.`id`')
            .whereRaw('`class_schendule`.`week_day` = ??',[Number(week_day)])
            .whereRaw('`class_schendule`.`sc_from` <= ??',[timeInMinutes])
            .whereRaw('`class_schendule`.`sc_to` > ??',[timeInMinutes])
        })
        .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*'])

        return res.json(classes)
    }

    async create(req: Request, res: Response) {
        const {
            name, avatar, whatsapp, bio, subject, cost, schedule

        } = req.body;
console.log(req.body)
        const trx = await db.transaction();

        try {

            const insertedUsersIds = await trx('users').insert({
                name, avatar, whatsapp, bio,
            })


            const user_id = insertedUsersIds[0];

            const insertedClassesids = await trx('classes').insert({
                subject, cost, user_id,
            })

            const class_id = insertedUsersIds[0];

            const classSchendule = schedule.map((schenduleItem: schenduleItem) => {
                return {
                    class_id,
                    week_day: schenduleItem.week_day,
                    sc_from: convertHourToMinute(schenduleItem.sc_from),
                    sc_to: convertHourToMinute(schenduleItem.sc_to),
                };
            })

            await trx('class_schendule').insert(classSchendule);

            await trx.commit();


            return res.status(201).send();

        } catch (err) {
            await trx.rollback();
console.log(err)
            return res.status(400).json({
                error: 'unexpected error while creating a new class'

            })
        }
    }

}