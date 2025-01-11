import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { extractSessionIdFromCookie } from "../shared/middleware/extract-session-id-from-cookie";
import { z } from "zod";
import { knex } from "../database";

export const mealsController = async (app: FastifyInstance) => {

    // TODO: Implement the endpoint to create a new meal
    app.post('/', { preHandler: extractSessionIdFromCookie }, async (request: FastifyRequest, response: FastifyReply) => {
        const createMealsBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            date: z.string(),
            isInDiet: z.boolean()
        })

        try {
            // TODO: Validate request body and extract meal data from request body
            const { name, description, date, isInDiet } = createMealsBodySchema.parse(request.body);

            // TODO: Create an unique ID for the meal
            const mealId = crypto.randomUUID()

            // TODO: Extract user ID and append it to the meal data
            const userId = request.user?.id

            // TODO: Save meal data to the database
            await knex('meals').insert({
                id: mealId,
                name,
                description,
                date,
                is_in_diet: isInDiet,
                user_id: userId,
            }).then(async () => {
                // TODO: Load meal from the database
                const mealCreated = await knex('meals').where('id', mealId).select().first();

                // TODO: Return success response with meal information
                return response.status(201).send({ meal: mealCreated });
            }).catch((error) => {
                console.error('Error creating meal', error);
                return response.status(500).send({
                    title: 'Internal Server Error',
                    message: 'Error creating meal, please try again later!'
                })
            })

        } catch (error) {
            _invalidBodyInRequestHandler(response, error);
        }
    })
}

const _invalidBodyInRequestHandler = (response: FastifyReply, error: unknown) => {
    console.error('Invalid request body', error);
    return response.status(400).send({
        title: 'Bad Request',
        message: 'Invalid request body, please provide meals informations!'
    })
}