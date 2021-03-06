function combinedOptimization(clientData, optimal) {
  // function to check network speed
  function networkCheck() {
    if (clientData.dynamicSpeed > clientData.dynamicMax) {
      clientData.networkSpeed = false;
      optimal.location = 'client';
    } else if (!clientData.dynamicSpeed) {
      clientData.missingDeviceInfo = true;
    } else optimal.location = 'server';
  }

  // function to check user's browser
  function browserCheck() {
    const browserOptions = ['Chrome', 'Firefox', 'Safari', 'Opera', 'IE'];
    let firstIndex = Infinity;
    for (let i = 0; i < browserOptions.length; i += 1) {
      if (clientData.userAgent.includes(browserOptions[i])) {
        const index = clientData.userAgent.indexOf(browserOptions[i]);
        if (index >= 0 && index < firstIndex) {
          firstIndex = index;
          clientData.browser = browserOptions[i];
        }
      }
    }
  }

  function threadCheck() {
    if (clientData.threads) {
      if (clientData.threads > clientData.maxWorkerThreads) {
        clientData.threads = clientData.maxWorkerThreads;
      }
      if (clientData.browser === 'Chrome') {
        if (clientData.threads > 25) optimal.threads = 25;
        else optimal.threads = clientData.threads;
      } else if (clientData.browser === 'Firefox' || clientData.browser === 'Safari') {
        if (clientData.threads > 14) optimal.threads = 14;
        else optimal.threads = clientData.threads;
      } else if (clientData.browser === 'Opera') {
        if (clientData.threads > 10) optimal.threads = 10;
        else optimal.threads = clientData.threads;
      } else clientData.threads < 4 ? optimal.threads = clientData.threads : optimal.threads = 4;
    } else optimal.threads = 4;
  }

  if (clientData.alwaysClient === false) networkCheck();
  if (optimal.location === 'client') {
    browserCheck();
    threadCheck();
  }
  // troubleshoot();

  // function troubleshoot() {
  //   const ideals = {
  //     Chrome: 40,
  //     Firefox: 20,
  //     Safari: 16,
  //     Opera: 16,
  //     IE: 4,
  //     Edge: 4
  //   }
  //   //if dev options exceed recommendations given client browser -->
  //   //reduce threads to below threshold...
  //   if (clientData.missingDeviceInfo === true) {
  //     console.log("Warning: missing client device data");
  //     optimal.location = clientData.fallback;
  //   } else if (clientData.maxWorkerThreads > ideal[clientData.browser]) {
  //     optimal.threads = ideal[clientData.browser];
  //   } else {
  //     optimal.threads = clientData.maxWorkerThreads;
  //   }
  //   console.log('will be processed here: ', optimal.location);
  // }
}


module.exports = combinedOptimization;
