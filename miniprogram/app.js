App({
  onLaunch() {
    this.globalData = {
      env: 'cloud1-7gqhwo2q6f73408d'
    };

    if (!wx.cloud) {
      console.error('Please use base library 2.2.3 or above to enable cloud capability.');
      return;
    }

    const cloudOptions = {
      traceUser: true
    };

    if (this.globalData.env) {
      cloudOptions.env = this.globalData.env;
    }

    wx.cloud.init(cloudOptions);
  }
});