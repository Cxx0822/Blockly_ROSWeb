<template>
  <div id="visualProgram" class="visualProgram">
    <el-row
      :gutter="10"
      type="flex">
      <el-col :span="12">
        <!-- blockly工作区 -->
        <div id="blocklyDiv" class="div-blocklyDiv">
          <!-- blockly工具栏 -->
          <!-- xml不能在浏览器中正常渲染，因此需要设置为不可见 -->
          <xml id="toolbox" style="display: none">
            <category name="逻辑控制" colour="%{BKY_LOGIC_HUE}">
              <category name="If" colour="#008B00">
                <block type="controls_if" />
                <block type="controls_if">
                  <mutation else="1" />
                </block>
                <block type="controls_if">
                  <mutation elseif="1" else="1" />
                </block>
              </category>

              <category name="Boolean" colour="%{BKY_LOGIC_HUE}">
                <block type="logic_compare" />
                <block type="logic_operation" />
                <block type="logic_negate" />
                <block type="logic_ternary" />
              </category>

              <category name="Loop" colour="%{BKY_LOOPS_HUE}">
                <block type="controls_repeat_ext">
                  <value name="TIMES">
                    <block type="math_number">
                      <field name="NUM">10</field>
                    </block>
                  </value>
                </block>
                <block type="controls_whileUntil" />
                <block type="controls_for">
                  <field name="VAR">i</field>
                  <value name="FROM">
                    <block type="math_number">
                      <field name="NUM">1</field>
                    </block>
                  </value>
                  <value name="TO">
                    <block type="math_number">
                      <field name="NUM">10</field>
                    </block>
                  </value>
                  <value name="BY">
                    <block type="math_number">
                      <field name="NUM">1</field>
                    </block>
                  </value>
                </block>
                <block type="controls_forEach" />
                <block type="controls_flow_statements" />
              </category>
            </category>

            <category name="数学运算" colour="%{BKY_MATH_HUE}">
              <block type="math_arithmetic" />
              <block type="math_single" />
              <block type="math_trig" />
              <block type="math_number_property" />
              <block type="math_round" />
              <block type="math_on_list" />
              <block type="math_modulo" />
              <block type="math_constrain">
                <value name="LOW">
                  <block type="math_number">
                    <field name="NUM">1</field>
                  </block>
                </value>
                <value name="HIGH">
                  <block type="math_number">
                    <field name="NUM">100</field>
                  </block>
                </value>
              </block>
              <block type="math_random_int">
                <value name="FROM">
                  <block type="math_number">
                    <field name="NUM">1</field>
                  </block>
                </value>
                <value name="TO">
                  <block type="math_number">
                    <field name="NUM">100</field>
                  </block>
                </value>
              </block>
              <block type="math_random_float" />
              <block type="math_atan2" />
            </category>

            <category name="列表运算" colour="%{BKY_LISTS_HUE}">
              <block type="lists_create_empty" />
              <block type="lists_create_with" />
              <block type="lists_repeat">
                <value name="NUM">
                  <block type="math_number">
                    <field name="NUM">5</field>
                  </block>
                </value>
              </block>
              <block type="lists_length" />
              <block type="lists_isEmpty" />
              <block type="lists_indexOf" />
              <block type="lists_getIndex" />
              <block type="lists_setIndex" />
            </category>

            <category name="文本控制" colour="%{BKY_TEXTS_HUE}">
              <block type="text_length" />
              <block type="text_print" />
            </category>

            <category name="常用变量" colour="#556B2F">
              <block type="math_number">
                <field name="NUM">1</field>
              </block>
              <block type="math_number">
                <field name="NUM">0</field>
              </block>
              <block type="math_number">
                <field name="NUM">-1</field>
              </block>
              <block type="logic_boolean" />
              <block type="logic_null" />
              <block type="math_constant" />
              <block type="text" />
            </category>

            <category name="ROS控制" colour="#FF7F00">
              <block type="turtlesim_move" />
            </category>
          </xml>

          <div class="div-run-code">
            <el-button class="el-button-run-code" icon="el-icon-video-play" @click="runJavascriptCode" />
            <el-button class="el-button-run-code" icon="el-icon-refresh" @click="refreshJavascriptCode" />
            <el-button class="el-button-run-code" icon="el-icon-video-pause" @click="stopJavascriptCode" />
            <el-button class="el-button-run-code" icon="el-icon-circle-close" @click="clearWorkspace" />
            <!-- <el-button @click="test">测试</el-button> -->
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="div-blockly-code">
          <!-- blockly代码区 -->
          <el-input
            v-model="blocklyCodeMessage"
            :disabled="true"
            :rows="39"
            type="textarea"
            class="el-input-blockly-code"
          />
        </div>
      </el-col>

      <el-col :span="6">
        <div class="div-blockly-console">
          <!-- blockly代码控制台 -->
          <el-input
            v-model="blocklyConsoleMessage"
            :disabled="true"
            :rows="39"
            type="textarea"
            class="el-input-blockly-console"
          />
        </div>

        <div class="div-clear-console">
          <el-button style="width:28px;height:28px;padding:0px;font-size:25px" icon="el-icon-circle-close" @click="clearConsoleMessage" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// https://github.com/bplok20010/eval5
import { Interpreter } from 'eval5'

import * as myblock from '@/utils/blocklytools/myBlockly'

// 引入Blockly
import Blockly from 'blockly'
// 引入想要转换的语言，语言有php python dart lua javascript
import 'blockly/javascript'
import 'blockly/python'
// 引入语言包并使用
import * as hans from 'blockly/msg/zh-hans'
Blockly.setLocale(hans)

import * as turtlesim from '@/utils/roswebtools/turtlesim'

export default {
  name: 'HelloWorld',
  data() {
    return {
      workspace: null,
      blocklyCodeMessage: '',
      blocklyConsoleMessage: '',
      jsCode: null,

      ros: null,
      isConnected: false,
      isRunWamNode: false,
      wamServerIp: '192.168.64.130',

      isDone: true
    }
  },
  mounted() {
    this.initBlockly()
    myblock.initMyBlockly()

    // 将自定义函数添加至window中，否则解析时，无法识别函数
    window.turtlesimMove = this.turtlesimMove
  },
  created() {
    this.ros = new ROSLIB.Ros({
      url: 'ws://' + this.wamServerIp + ':9090'
    })

    this.ros.on('connection', () => {
      this.isConnected = true
      this.$message.success('连接ROS成功！')
      this.blocklyConsoleMessage += '连接ROS成功！' + '\n'
    })

    this.ros.on('error', (e) => {
      this.isConnected = false
      this.$message.error('连接ROS失败！')
      this.blocklyConsoleMessage += '连接ROS失败！' + '\n'
    })

    this.ros.on('close', () => {
      this.isConnected = false
      this.$message.error('关闭ROS连接！')
      this.blocklyConsoleMessage += '关闭ROS连接！' + '\n'
    })
  },
  beforeDestroy() {
    // 关闭ros连接
    if (this.isConnected) {
      this.ros.close()
    }
  },
  methods: {
    initBlockly() {
      this.workspace = myblock.initBlockly('blocklyDiv', 'toolbox')
      // 工作区监听代码生成器
      this.workspace.addChangeListener(this.myUpdateFunction)
      var toolbox = Blockly.getMainWorkspace().getToolbox()
    },
    // 代码生成器
    myUpdateFunction(event) {
      var codeJs = Blockly.JavaScript.workspaceToCode(this.workspace)
      this.blocklyCodeMessage = codeJs
    },
    async runJavascriptCode() {
      // const interpreter = new Interpreter(window, {
      //   timeout: 1000
      // })
      // 实例化JavaScript解释器eval5
      const interpreter = new Interpreter(window)
      // Blokly获取JavaScript代码
      this.jsCode = Blockly.JavaScript.workspaceToCode(this.workspace)

      try {
        // 代码预检查
        var isOk = this.checkCode()

        if (isOk) {
          // 按分号切分指令
          var jsCodeList = this.jsCode.split(';')
          for (var i = 0; i < jsCodeList.length - 1; i++) {
            // await 执行evaluate()
            var result = await interpreter.evaluate(jsCodeList[i])
            this.blocklyConsoleMessage += result + '\n'
          }
          // 异常处理
          if (this.isDone === false) {
            this.$message.error('运行错误！')
          }
        } else {
          // 预检查错误
          this.blocklyConsoleMessage += '运行错误' + '\n'
        }
      } catch (e) {
        // 运行错误
        this.blocklyConsoleMessage += e + '\n'
      }
    },
    refreshJavascriptCode() {
      this.isDone = true
      this.$message.success('重置程序')
    },
    stopJavascriptCode() {
      this.$message.error('停止运行')
    },
    clearWorkspace() {
      this.workspace.clear()
      this.$message.success('清除工作空间')
    },
    clearConsoleMessage() {
      this.blocklyConsoleMessage = ''
    },
    async turtlesimMove(x, y) {
      if (this.isDone) {
        try {
          this.isDone = false
          await turtlesim.callTurtlesimMoveService(this.ros, x, y, 0)
          this.isDone = true
          return 'turtlesim' + '向右移动了' + x + ',向上移动了' + y + '.'
        } catch (error) {
          this.isDone = false
          return '运行错误'
        }
      }
    },
    checkCode() {
      // 没有错误
      if (this.jsCode.length === 0) {
        this.$message.error('请输入指令')
        return false
      } else if (this.jsCode.indexOf('WAMERROR') === -1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#visualProgram .el-input-blockly-code /deep/ .el-textarea__inner{
  color: black;
  background-color: white
}
#visualProgram .el-input-blockly-console /deep/ .el-textarea__inner{
  color: black;
  background-color: white
}
</style>

<!-- 这里需要是全局样式，即去掉scoped -->
<!-- 这里加上页面的id https://www.jianshu.com/p/4ff9a5397427 -->
<style>
@import "../utils/blocklytools/toolboxStyle.css";
.div-blocklyDiv{
  width:800px;
  height:850px;
  margin-top: 20px;
  margin-left: 20px;
  position: relative;
  border: 2px solid #008B93;
}
.div-run-code{
  position: absolute;
  right: 300px;
  /* bottom: 800px; */
  bottom: 30px;
  z-index: 2;
}
.el-button-run-code{
  width:40px;
  height:40px;
  padding:0px;
  font-size:30px
}
.div-blockly-code{
  margin-top: 20px;
  height:850px;
  color: #008B93;
  border: 2px solid #008B93;
}
.div-blockly-console{
  margin-top: 20px;
  margin-right: 10px;
  height:850px;
  border: 2px solid #008B93;
}
.el-input-blockly-code{
  width: 99%;
  margin: 2px;
  border: 1px solid #008B93;
}
.el-input-blockly-console{
  width: 99%;
  margin: 2px;
  border: 1px solid #008B93;
}
.div-clear-console{
  position: absolute;
  right: 25px;
  top: 30px;
  z-index: 2;
}
</style>
