import { Request, Response } from 'express'
import { CustomError } from '../../domain'
import { FileUploadService } from '../services/file-upload.service'
import { UploadedFile } from 'express-fileupload'

export class FileUploadController {
	constructor(private readonly fileUplaodService: FileUploadService) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message })
		}
		console.log(error)
		return res.status(500).json({ error: 'Internal server error' })
	}

	uploadFile = (req: Request, res: Response) => {
		const type = req.params.type
		const file = req.body.files[0] as UploadedFile

		this.fileUplaodService
			.uploadSingle(file, `uploads/${type}`)
			.then(uploaded => res.json(uploaded))
			.catch(error => this.handleError(error, res))
	}

	uploadMultipleFiles = (req: Request, res: Response) => {
		const type = req.params.type
		const files = req.body.files as UploadedFile[]

		this.fileUplaodService
			.uploadMiltiple(files, `uploads/${type}`)
			.then(uploaded => res.json(uploaded))
			.catch(error => this.handleError(error, res))
	}
}
