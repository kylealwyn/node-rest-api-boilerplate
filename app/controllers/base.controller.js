class BaseController {
	formatApiError(err) {
		if (!err) {
			// eslint-disable-next-line no-console
			console.error('Provide an error');
			throw new Error('Provide an error.');
		}

		const formatted = {
			message: err.message
		};

		if (err.errors) {
			formatted.errors = {};
			const errors = err.errors;
			for (const type in errors) {
				formatted.errors[type] = errors[type].message
			}
		}

		return formatted;
	}
}

export default BaseController
