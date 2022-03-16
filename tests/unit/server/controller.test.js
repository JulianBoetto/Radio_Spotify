import { 
    jest,
    expect,
    describe,
    test,
    beforeEach
} from '@jest/globals'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'
import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
const { pages } = config

describe('#controller - test site for controller return', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks
    })

    test('getFileStream - should return a file stream', async () => {
        const mockFileStream = TestUtil.generateReadableStream(['data'])
        const expectedType = '.html'

        const mockResolved = jest.spyOn(
            Service.prototype,
            Service.prototype.getFileStream.name
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })

        const controller = new Controller()
        const controllerReturn = await controller.getFileStream('./index.html')

        expect(mockResolved).toBeCalledTimes(1)
        expect(mockResolved).toBeCalledWith('./index.html')
        expect(controllerReturn).toStrictEqual({
            stream: mockFileStream,
            type: expectedType
        })
    })

})