import { 
    jest,
    expect,
    describe,
    test,
    beforeEach
} from '@jest/globals'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import config from '../../../server/config.js'
import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
const {
    dir: {
        publicDirectory
    }
} = config

describe('#service - test site for service return', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks
    })

    test('createFileStream - should create a file stream', async () => {
        const file = './index.html'
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        const createReadStream = jest
            .spyOn(fs, fs.createReadStream.name)
            .mockReturnValue(mockFileStream)

        const service = new Service()
        const serviceReturn = service.createFileStream(file)

        expect(createReadStream).toBeCalledWith(file)
        expect(createReadStream).toBeCalledTimes(1)
        expect(serviceReturn).toStrictEqual(mockFileStream)
    })

    test('getFileInfo - should return file info', async () => {
        const file = '/index.html'
        const expectedFullFilePath = publicDirectory + file
        const expectedType = '.html'

        jest.spyOn(path, 'join').mockReturnValue(file)
        jest.spyOn(fsPromises, 'access').mockResolvedValue()
        jest.spyOn(path, 'extname').mockReturnValue(expectedType)

        const service = new Service()
        const serviceReturn = await service.getFileInfo(file)

        expect(fsPromises.access).toHaveBeenCalledWith(expectedFullFilePath)
        expect(serviceReturn).toStrictEqual({
            name: expectedFullFilePath,
            type: expectedType
        })
    })

    test('getFileStream - should return a file stream', async () => {
        const file = '/index.html'
        const expectedType = '.html'
        const mockFileStream = TestUtil.generateReadableStream(['data'])

        const mockResolvedInfo = jest.spyOn(
            Service.prototype,
            'getFileInfo'
        ).mockReturnValue({
            stream: mockFileStream,
            type: expectedType
        })

        const mockResolvedCreate = jest.spyOn(
            Service.prototype,
            'createFileStream'
        ).mockReturnValue(mockFileStream)

        const service = new Service()
        const serviceReturn = await service.getFileStream(file)

        expect(mockResolvedInfo).toBeCalledTimes(1)
        expect(mockResolvedInfo).toBeCalledWith(file)
        expect(serviceReturn).toStrictEqual({
            stream: mockFileStream,
            type: expectedType
        })
    })

})