using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Felica.RNFelica
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNFelicaModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNFelicaModule"/>.
        /// </summary>
        internal RNFelicaModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNFelica";
            }
        }
    }
}
