import _ from 'lodash'

export const getBoolEnv = (envParName, defaultValue) => _.get(process.env, envParName, `${defaultValue}`) === 'true'

export const getIntEnv = (envParName, defaultValue) => {
    const strValue = _.get(process.env, envParName, `${defaultValue}`)
    const parsedValue = parseInt(strValue, 10)
    if (isNaN(parsedValue)) {
        return 0
    }
    return parsedValue
}
