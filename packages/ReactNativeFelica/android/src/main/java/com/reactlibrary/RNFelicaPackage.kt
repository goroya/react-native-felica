package com.reactlibrary

import java.util.Arrays
import java.util.Collections

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.bridge.JavaScriptModule
import com.reactlibrary.felicaView.RNFelicaDumpViewManager


class RNFelicaPackage : ReactPackage {

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return Arrays.asList<NativeModule>(RNFelicaModule(reactContext))
  }

  // Deprecated from RN 0.47
  fun createJSModules(): List<Class<out JavaScriptModule>> {
    return emptyList()
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return Arrays.asList<ViewManager<*, *>>(
        RNFelicaDumpViewManager()
    )
  }
}
