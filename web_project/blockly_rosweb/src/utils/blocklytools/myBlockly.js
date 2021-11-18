// 引入Blockly
import Blockly from 'blockly'

// 1. 为了创建自定义类别，先创建自定义类别，继承自Blockly.ToolboxCategory
class CustomCategory extends Blockly.ToolboxCategory {
  // 自定义类别创造函数
  // categoryDef: 类别定义的信息
  // toolbox: 表示类别的父级toolbox
  // opt_parent: 可选参数，表示其父类别
  constructor(categoryDef, toolbox, optParent) {
    super(categoryDef, toolbox)
  }

  // ToolboxCategory类中默认的方法addColourBorder_会在类别的左侧添加一个颜色条，
  // 在定制类CustomCategory中覆盖此方法，将其改为设置背景色
  addColourBorder_(colour) {
    this.rowDiv_.style.backgroundColor = colour
  }

  // 如果两次点击某个类别，会发现背景色消失了，
  // 为了解决这个问题，重写setSelected这个方法
  setSelected(isSelected) {
  // 使用getElementsByClassName选中类别对应的span元素
    var labelDom = this.rowDiv_.getElementsByClassName('blocklyTreeLabel')[0]
    if (isSelected) {
      // 选中的类别背景色设置为白色
      this.rowDiv_.style.backgroundColor = 'white'
      // 选中的类别文本设置为原背景色
      labelDom.style.color = this.colour_
      // 设置icon的颜色和文本颜色相同
      this.iconDom_.style.color = this.colour_
    } else {
      // 未选中的类别背景色设置
      this.rowDiv_.style.backgroundColor = this.colour_
      // 未选中的类别文本设置为白色
      labelDom.style.color = 'black'
      // 设置icon的颜色和文本颜色相同
      this.iconDom_.style.color = 'black'
    }
    // This is used for accessibility purposes.
    Blockly.utils.aria.setState(/** @type {!Element} */ (this.htmlDiv_),
      Blockly.utils.aria.State.SELECTED, isSelected)
  }

  // // 将icon图标改成image
  // createIconDom_ () {
  //   const img = document.createElement('img')
  //   img.src = './logo_only.svg'
  //   img.alt = ''
  //   img.width = '35'
  //   img.height = '25'
  //   return img
  // }
}

// 2. 自定义类别需要向Blockly注册，告知自定义类别的存在，不然会无法识别新建的类
Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  Blockly.ToolboxCategory.registrationName,
  CustomCategory, true)

export const initBlockly = (div, toolbox) => {
  return Blockly.inject(div,
    {
      // 工具栏
      toolbox: document.getElementById(toolbox),
      // 网格效果
      grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
      // 媒体资源 (该框架下需要将资源文件放在public文件夹下)
      media: './static/media/',
      // 垃圾桶
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    }
  )
}

export const initMyBlockly = () => {
  Blockly.Blocks['turtlesim_move'] = {
    init: function() {
      this.appendValueInput('X')
        .setCheck('Number')
        .appendField('移动方向：x')
      this.appendValueInput('Y')
        .setCheck('Number')
        .appendField('移动方向：y')
      this.setInputsInline(false)
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(230)
      this.setTooltip('')
      this.setHelpUrl('')
    }
  }

  Blockly.JavaScript['turtlesim_move'] = (block) => {
    // 后面的 || '\'\'' 部分表示当输入为空时 返回的值
    var x = Blockly.JavaScript.valueToCode(block, 'X',
      Blockly.JavaScript.ORDER_FUNCTION_CALL)
    var y = Blockly.JavaScript.valueToCode(block, 'Y',
      Blockly.JavaScript.ORDER_FUNCTION_CALL)
    // 无输入
    if (x === '' || y === '') {
      return 'WAMERROR: 参数错误 请输入正确的参数！'
    } else {
      return 'turtlesimMove' + '(' + x + ',' + y + ')' + ';' + '\n'
      // return 'test()' + ';' + '\n'
    }
    // 第二个参数为当前使用的操作符对应的优先级 https://www.wenjiangs.com/doc/wkeldh8c
    // return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL]
    // return code
  }
}
