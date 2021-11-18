#include <ros/ros.h>
#include <geometry_msgs/Twist.h>
#include <turtlesim_move/turtlesim_move_srv.h>

#include <iostream>
#include <unistd.h>

ros::Publisher turtle_vel_pub;

// service回调函数，输入参数req，输出参数res
bool moveCallback(turtlesim_move::turtlesim_move_srv::Request  &req,
         			turtlesim_move::turtlesim_move_srv::Response &res)
{
	geometry_msgs::Twist vel_msg;
	vel_msg.linear.x = req.x;
	vel_msg.linear.y = req.y;
	vel_msg.linear.z = req.z;
	turtle_vel_pub.publish(vel_msg);

	// 设置反馈数据
	sleep(2);
	
	res.result = true;

    return res.result;
}

int main(int argc, char **argv)
{
    // ROS节点初始化
    ros::init(argc, argv, "turtlesim_move_server");

    // 创建节点句柄
    ros::NodeHandle n;

    // 创建一个名为/turtlesim_move的server，注册回调函数moveCallback
    ros::ServiceServer move_service = n.advertiseService("/turtlesim_move", moveCallback);

	// 创建一个Publisher，发布名为/turtle1/cmd_vel的topic，消息类型为geometry_msgs::Twist，队列长度10
	turtle_vel_pub = n.advertise<geometry_msgs::Twist>("/turtle1/cmd_vel", 10);

	ros::spin();

    return 0;
}


