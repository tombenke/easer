export const defaultApi = {
    swagger: '2.0',
    info: {
        title: 'An API that provides the current directory as static content',
        version: '1.0'
    },
    paths: {
        '/': {
            get: {
                'x-static': {
                    contentPath: process.cwd(),
                    config: {
                        dotfiles: 'allow',
                        index: true
                    }
                },

                responses: {
                    200: {
                        description: 'OK'
                    }
                }
            }
        }
    }
}
