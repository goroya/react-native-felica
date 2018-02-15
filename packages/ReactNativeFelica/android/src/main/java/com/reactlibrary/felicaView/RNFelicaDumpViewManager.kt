package com.reactlibrary.felicaView

import android.widget.TextView
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.yoga.YogaMeasureFunction
import com.facebook.yoga.YogaMeasureMode
import com.facebook.yoga.YogaMeasureOutput
import com.facebook.yoga.YogaNode
import com.facebook.react.uimanager.annotations.ReactProp




class RNFelicaDumpShadowNode : LayoutShadowNode(), YogaMeasureFunction {

  override fun measure(node: YogaNode?, width: Float, widthMode: YogaMeasureMode?, height: Float, heightMode: YogaMeasureMode?): Long {
    return YogaMeasureOutput.make(0, 0);
  }
}

class RNFelicaDumpViewManager: SimpleViewManager<TextView>() {
  private val REACT_CLASS = "MyTextView"

  //②
  override fun getName(): String {
    return REACT_CLASS
  }

  override fun createViewInstance(context: ThemedReactContext): TextView {
    return TextView(context)
  }

  //③
  @ReactProp(name = "value")
  fun setValue(view: TextView, value: String) {
    view.text = value
  }
}
