import { jest, expect, describe, test, beforeEach, it } from '@jest/globals'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'
import {handler} from '../../../server/routes.js'
import TestUtil from '../_util/testUtil.js'
const {
  pages,
  location
} = config

describe('Routes - test suite for api response', () => {
  
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })
  
  test('GET / - should redirect to home page', async () => {
    const params = TestUtil.defaultHandlerParams();
    params.request.method = 'GET'
    params.request.url = '/'
    await handler(params.values())
    expect(params.response.writeHead).toHaveBeenCalled(
      302,{'Location': location.home}
      )
      expect(params.response.end).toHaveBeenCalled()
  })
  
  test(`GET /home - should response with ${pages.homeHTML} file stream`, async () => {
    const params = TestUtil.defaultHandlerParams();
    params.request.method = 'GET'
    params.request.url = '/'
    const mockFileStream = TestUtil.generateReadableStream(['data'])
    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name,
    ).mockRejectedValue({
      stream: mockFileStream,
    })
    
    jest.spyOn(
      mockFileStream,
      "pipe"
    ).mockReturnValue()

    await handler(params.values())
    expect(Controller.prototype.getFileStream).toHaveBeenCalled(location.home)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    expect(params.response.end).toHaveBeenCalled()
  })
  
  test.todo(`GET /controller - should response with ${pages.controllerHTML} file stream`)
  test.todo(`GET /file.ext - should response with file stream`)
  test.todo(`GET /unknow - given an inexistent route it should response with 404`)
  

  describe('exception', () => {
    test.todo('given inexistent file it sholud respond with 404')
    test.todo('given an error it should respond with 500')
  })
})