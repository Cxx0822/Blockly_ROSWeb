export const callTurtlesimMoveService = (ros, x, y, z) => {
  var service = new ROSLIB.Service({
    ros: ros,
    name: '/turtlesim_move',
    serviceType: 'turtlesim_move/turtlesim_move_srv'
  })

  var request = new ROSLIB.ServiceRequest({
    x: x,
    y: y,
    z: z
  })

  return new Promise((resolve, reject) => {
    service.callService(request, (result) => {
      resolve(result)
    // 异常处理
    }, (falseResult) => {
      // 抛出异常
      reject(new Error('error'))
    })
  })
}
