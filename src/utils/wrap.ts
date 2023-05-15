import { logger } from './logger'
import { ApiError } from './api-error'
import { Request, Response } from 'express'

// eslint-disable-next-line no-unused-vars
type Controller = (req: Request, res?: Response) => object | string | undefined

function wrap(...controllers: Controller[]) {
  return async (req: Request, res: Response) => {
    try {
      for (let controllerIndex = 0; controllerIndex < controllers.length - 1; controllerIndex++) {
        await controllers[controllerIndex](req, res)
      }
      const controller = controllers[controllers.length - 1]
      const result = await controller(req, res)
      if (!result) {
        res.send({}).status(204)
      } else {
        res.send(result).status(200)
      }
    } catch (e) {
      logger.error(e)
      if (e instanceof ApiError) {
        res.json({ message: e.message }).status(e.statusCode)
      } else {
        res.send('Internal server error').status(500)
      }
    }
  }
}

export { wrap }
