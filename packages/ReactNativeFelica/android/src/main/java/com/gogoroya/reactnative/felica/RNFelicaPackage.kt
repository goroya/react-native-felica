package com.gogoroya.reactnative.felica

import java.util.Arrays

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.bridge.JavaScriptModule


class RNFelicaPackage : ReactPackage {

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return Arrays.asList<NativeModule>(RNFelicaModule(reactContext))
  }

  // Deprecated from RN 0.47
  fun createJSModules(): List<Class<out JavaScriptModule>> {
    return emptyList()
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}
