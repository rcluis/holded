module.exports = () => {
    return {
        handleError: (message) => {
            return {
                error: {
                    message,
                }
            }
        },
        handleSuccess: (message, data = '') => {
            return {
                message,
                data
            }
        }
    }
}