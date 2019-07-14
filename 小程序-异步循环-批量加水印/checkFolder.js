const _api = require('../../../../utils/api.js');
const app = getApp();
const commonjs = require('../../../common/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 第几个文件夹
    index: null,
    // 案件编号
    caseCode: String,
    // 任务编码
    taskCode: String,
    // oSS权限
    author: null,
    // 文件数据
    fileList: [],
    // 基础文件夹
    initFolders: Array,
    // 查勘说明
    surveyComment: String,
    // 所有文件
    allFolders: Array,
    // 被选中要移动的文件
    choiceFile: null,
    x: 0,
    y: 0,
    // 可移动区域的信息
    moveAreaTop: '',
    moveAreaLeft: '',
    // 所有元素集合
    elements: [],
    hidden: true,
    // 选中的序号
    beginIndex: Number,
    // 点击时间戳
    timeStamp: 0,
    // 操作权限
    readOnly: Boolean,
    // 回收站文件夹
    recycleBin: null,
    // 所有文件夹
    allinitFolders: null,
    // 画布的宽
    cameraWidth: 0,
    // 画布的高
    cameraHeight: 0,
    // 分辨率
    pixelRatio: 1,
    // 设备信息
    system: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    commonjs.Loading.showLoading();
    // 判断进入的是附件文件或者是回收站文件夹
    const flag = options.i;
    let index, allFolders, folder;
    if (['caseAttachFolder', 'recycleBin'].includes(flag)) {
      folder = wx.getStorageSync('allFolders');
      const allinitFolders = wx.getStorageSync('allFolders');
      this.setData({
        fileList: wx.getStorageSync(flag).fileList,
        allinitFolders: allinitFolders
      });
      // 设置标题
      wx.setNavigationBarTitle({
        title: flag === 'caseAttachFolder' ? '公估报告附件' : '文件回收站',
      });
    } else {
      index = options.i * 1;
      allFolders = wx.getStorageSync('allFolders');
      this.setData({
        fileList: allFolders[index].fileList
      });
      // 设置标题
      wx.setNavigationBarTitle({
        title: allFolders[index].name,
      });
    }
    // const allFolders = wx.getStorageSync('allFolders');
    // 设置对应的数据
    this.setData({
      caseCode: options.caseCode,
      taskCode: options.taskCode,
      index: index || flag,
      allFolders: allFolders || folder
    }, () => {
      this.authorOSS();
    });

    // 获取回收站文件夹
    this.data.recycleBin = wx.getStorageSync('recycleBin');

    console.log(this.data.index !== 'recycleBin');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取上一级页面的数据
    const pages = getCurrentPages();
    this.setData({
      initFolders: pages[pages.length - 2].data.initFolders,
      readOnly: pages[pages.length - 2].data.readOnly
    });
    const flag = this.data.index;
    if ('caseAttachFolder' === flag) {
      this.setData({
        readOnly: true
      });
    }

    // 获取设备分辨率
    wx.getSystemInfo({
      success: res => {
        this.setData({
          pixelRatio: res.pixelRatio,
          system: res.system
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取全局所有文件数据
    wx.getStorage({
      key: 'surveyComment',
      success: res => {
        this.setData({
          surveyComment: res.data
        });
      }
    });
    commonjs.Loading.hideLoading();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  // oss上传权限
  authorOSS() {
    const caseCode = this.data.caseCode,
          taskCode = this.data.taskCode;
    wx.request({
      url: _api.AppConfig.serverURL + 'upload/function012',
      method: 'POST',
      data: {
        taskCode: taskCode,
        caseCode: caseCode
      },
      success: res => {
        if (res.statusCode === 200 && res.data.error.no === 0) {
          this.setData({
            author: res.data.result
          });
        } else {
          wx.showToast({
            title: res.data.error.info,
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: () => {
        console.log('获取OSS权限失败');
      }
    })
  },

  /* 点击添加 */
  add() {
    wx.showActionSheet({
      itemList: ['从相册选择', '拍照'],
      itemColor: '#03A9F4',
      success: res => {
        const index = res.tapIndex;
        // 从相册选择0，拍照1
        switch(index) {
          case 0:
            this.chooseAlbum();
            break;
          case 1:
            this.shotCamera();
            break;
        }
      }
    });
  },

  /* 点击确定按钮 */ 
  save() {
    commonjs.Loading.showLoading('保存中...');
    // 先修改全局中的数据
    // 当前文件夹
    const curIndex = this.data.index;
    if (curIndex === 'recycleBin') {
      wx.setStorageSync('allFolders', this.data.allinitFolders);
      wx.setStorageSync('recycleBin', {
        name: '文件回收站',
        fileList: this.data.fileList
      });
    } else {
      this.data.allFolders[curIndex].fileList = this.data.fileList;
      wx.setStorageSync('allFolders', this.data.allFolders);
      wx.setStorageSync('recycleBin', this.data.recycleBin);
    }
    // 其他不显示的文件
    const otherAllFiles = wx.getStorageSync('otherFiles');
    // 回收站文件
    const recycleBinFiles = wx.getStorageSync('recycleBin').fileList;
    // 组合所有文件
    const allFolders = this.data.allFolders;
    let allFiles = [];
    allFolders.forEach(folder => {
      if (folder.fileList.length) {
        allFiles = allFiles.concat(folder.fileList);
      }
    });
    otherAllFiles.length && (allFiles = allFiles.concat(otherAllFiles));
    recycleBinFiles.length && (allFiles = allFiles.concat(recycleBinFiles));
    // 向后台发送数据
    let investigationFiles = [], 
        investigationFileTitles = [], 
        investigationTypes = [], 
        investigationIsDeletes = [];
    // 上传所有文件
    allFiles.forEach(file => {
      if (file.file) {
        // 向OSS上传新的文件
        const fileData = {
          key: file.investigationFile,
          policy: this.data.author.policy,
          OSSAccessKeyId: this.data.author.accessid,
          success_action_status: 200,
          Signature: this.data.author.signature,
          "x-oss-security-token": this.data.author.securityToken
        };
        wx.uploadFile({
          url: this.data.author.host,
          filePath: file.file,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
          },
          formData: fileData,
          success: res => {
            
          }
        });
      }
      // 所有key值
      investigationFiles.push(file.investigationFile);
      // 所有的文件标题
      investigationFileTitles.push(file.investigationFileTitle);
      // 所有文件类型
      investigationTypes.push(file.investigationType);
      // 所有是否删除标志
      investigationIsDeletes.push(file.investigationIsDelete);
    });
    // 向后台发送数据
    const dataObj = {
      caseCode: this.data.caseCode,
      userCode: app.globalData.userCode,
      taskCode: this.data.taskCode,
      investigationFiles: investigationFiles.join(',') || '@@##$$',
      investigationFileTitles: investigationFileTitles.join(',') || '@@##$$',
      investigationTypes: investigationTypes.join(',') || '@@##$$',
      investigationComment: this.data.surveyComment || '@@##$$',
      investigationIsDeletes: investigationIsDeletes.join(',') || '@@##$$',
    };
    wx.request({
      url: _api.AppConfig.serverURL + 'fcxc/function010',
      method: 'POST',
      data: dataObj,
      success: res => {
        if (res.statusCode === 200 && res.data.error.no === 0) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000,
            complete: () => {
              commonjs.Loading.hideLoading();
              wx.navigateBack({
                delta: 1
              });
            }
          });
        } else {
          wx.showToast({
            title: res.data.error.info,
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: () => {
        console.log('后台传送数据失败');
      },
      complete: () => {
        commonjs.Loading.hideLoading();
      }
    });
  },

  /* 从相册选择 */
  chooseAlbum() {
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: async res => {
        await commonjs.Loading.showLoading();
        // 获取本地图片路径
        const localPaths = Array.from(res.tempFilePaths);
        const localNewPaths = await this.handleImageWaterMark(localPaths);
        // console.log(localNewPaths);
        await this.handleLocalFiles(localNewPaths);
        await commonjs.Loading.hideLoading();
      }
    })
  },

  /* 从相机拍照 */ 
  shotCamera() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: async res => {
        await commonjs.Loading.showLoading();
        // 获取本地图片路径
        const localPaths = Array.from(res.tempFilePaths);
        // console.log(localPaths);
        const localNewPaths = await this.handleImageWaterMark(localPaths);
        await this.handleLocalFiles(localNewPaths);
        await commonjs.Loading.hideLoading();
        this.saveSelfPhone(localNewPaths[0]);
      }
    })
  },

  // 存手机中
  saveSelfPhone(path) {
    wx.saveImageToPhotosAlbum({
      filePath: path,
    });
  },

  //  处理图片，加水印
  async handleImageWaterMark(localPaths) {
    // 时间
    const time = new Date().toLocaleDateString();
    // 获取画布
    const ctx = wx.createCanvasContext('cameraCanvas');
    const result = [];
    for (let path of localPaths) {
      const temPath = await this.imageAddWaterMark(path, time, ctx);
      result.push(temPath);
    }
    await ctx.restore();
    return result;
  },

  // 具体加水印
  imageAddWaterMark(path, time, ctx) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: path,
        success: res => {
          // 设置画布的宽高
          this.setData({
            cameraWidth: res.width,
            cameraHeight: res.height
          });
          // 不同平台设置不同样式，根据分辨率
          if (this.data.system.indexOf('Android') !== -1) {
            ctx.setFontSize(15)
          } else {
            ctx.setFontSize(20 * this.data.pixelRatio)
          }
          ctx.setFillStyle('#CC5D7C');
          ctx.save();
          // 画
          ctx.beginPath();
          ctx.drawImage(res.path, 0, 0, res.width, res.height);
          if (this.data.system.indexOf('Android') !== -1) {
            ctx.fillText(app.globalData.city, res.width - 350 / this.data.pixelRatio, res.height - 100 / this.data.pixelRatio);
          } else {
            ctx.fillText(app.globalData.city, res.width - 350, res.height - 100 / this.data.pixelRatio);
          }
          ctx.fillText(time, 50 / this.data.pixelRatio, res.height - 100 / this.data.pixelRatio);
          // 开始画
          ctx.draw(false, () => {
            // setTimeout处理低配安卓兼容问题，api调用失败
            const timer = setTimeout(() => {
              wx.canvasToTempFilePath({
                canvasId: 'cameraCanvas',
                x: 0,
                y: 0,
                destWidth: this.data.cameraWidth * this.data.pixelRatio,
                destHeight: this.data.cameraHeight * this.data.pixelRatio,
                quality: 1,
                fileType: 'jpg',
                success: res1 => {
                  resolve(res1.tempFilePath);
                },
                fail: err => {
                  commonjs.Tips.showTipError('wx.canvasToTempFilePath'+'调取失败！');
                },
                complete: () => {
                  clearTimeout(timer);
                }
              })
            }, 200);
          })
        },
      })
    });
  },

  /* 处理本地文件 */ 
  handleLocalFiles(localData) {
    localData.forEach(val => {
      // 处理出文件名字
      let photoUrl = val.split('/');
      // 每个新的文件对象
      let nameArr = photoUrl[photoUrl.length - 1].split('.');
      // 扩展名
      const extension = `.${nameArr[nameArr.length - 1]}`;
      // 去掉数组中的扩展名并且组合成新的字符串
      nameArr.pop();
      const name = nameArr.join('');
      const newName = `${name}${extension}`;
      // 拼出key值
      let key = `${this.data.author.dir}${this.data.initFolders[this.data.index]}/${newName}`;
      let newFileItem = {
        name: name,
        extension: extension,
        file: val,
        editing: false,
        uploadPath: '',
        imgUrl: val,
        investigationType: 2,
        investigationFile: key,
        investigationFileTitle: newName,
        investigationIsDelete: 2,
        investigationID: ''
      };
      this.data.fileList.push(newFileItem);
    });
    this.setData({
      fileList: this.data.fileList
    });
  },

  /* 点击文件下发删除按钮 */ 
  delFile(event) {
    // 获取点击删除的序号
    const delIndex = event.target.dataset.idx;
    let delItem = this.data.fileList.splice(delIndex, 1)[0];
    // 更新视图
    this.setData({
      fileList: this.data.fileList
    });
    // 将其放入回收文件夹
    delItem.investigationIsDelete = 1;
    this.data.recycleBin.fileList.push(delItem);
  },

  /* 点击还原按钮 */
  reset(event) {
    const resetIndex = event.target.dataset.idx;
    let resetItem = this.data.fileList.splice(resetIndex, 1)[0];
    // 更新视图
    this.setData({
      fileList: this.data.fileList
    });
    // 将其放回原来的文件夹
    const match = resetItem.investigationFile.split('/');
    const index = this.data.initFolders.findIndex(val => match[2] === val);
    resetItem.investigationIsDelete = 2;
    this.data.allinitFolders[index].fileList.push(resetItem);
    // this.setData({
    //   allinitFolders: this.data.allinitFolders
    // });
  },

  /* 预览图片 */ 
  previewImg(event) {
    const previewIndex = event.target.dataset.idx;
    let previewImgs = [];
    this.data.fileList.forEach(file => {
      previewImgs.push(file.imgUrl);
    });
    wx.previewImage({
      urls: previewImgs,
      current: previewImgs[previewIndex]
    });
  },

  /* 点击文件名字 */ 
  editImgTitle(event) {
    if (this.data.readOnly) {
      return
    }
    const curIndex = event.target.dataset.idx;
    this.data.fileList[curIndex].editing = true;
    this.setData({
      fileList: this.data.fileList
    });
  },

  /* 输入文件名失去焦点 */
  editImgTitleBlur(event) {
    const curIndex = event.target.dataset.idx;
    let value = event.detail.value;
    let handleValue = value.replace(/[.\/,]/g, "");
    this.data.fileList[curIndex].editing = false;
    this.data.fileList[curIndex].name = handleValue;
    this.data.fileList[curIndex].investigationFileTitle = handleValue + this.data.fileList[curIndex].extension;
    this.setData({
      fileList: this.data.fileList
    });
  },

  /* 获取元素 */
  nodes(option) {
    // 拖拽图片
    // 获取所有item
    let query = wx.createSelectorQuery();
    let nodesRef = query.selectAll(option)
    nodesRef.fields({
      dataset: true,
      rect: true,
      size: true
    }, (res) => {
      this.setData({
        elements: res
      })
    }).exec()
  }, 

  /* 长按图片 */
  longtap(ev) {
    let query = wx.createSelectorQuery();
    let nodesRef = query.selectAll("#moveArea")
    nodesRef.fields({
      rect: true
    }, res => {
      this.setData({
        moveAreaTop: res[0].top,
        moveAreaLeft: res[0].left
      });
      this.setData({
        x: ev.touches[0].clientX - res[0].left - this.data.elements[0].width / 2,
        y: ev.touches[0].clientY - res[0].top - this.data.elements[0].width / 2
      })
    }).exec();
    this.setData({
      hidden: false,
      moveImgFlag: true
    });
  },

  /* 开始按 */
  touchstart(ev) {
    const index = ev.currentTarget.dataset.idx
    this.setData({
      beginIndex: index,
      choiceFile: this.data.fileList[index]
    });
    this.nodes(".item");
  },

  /* 移动时候 */
  touchmove(ev) {
    if (this.data.moveImgFlag) {
      const x = ev.touches[0].clientX
      const y = ev.touches[0].clientY
      this.setData({
        x: x - this.data.moveAreaLeft - this.data.elements[0].width / 2,
        y: y - this.data.moveAreaTop - this.data.elements[0].height / 2
      })
    }
  },

  // 抬起手指
  touchend(ev) {
    if (!this.data.moveImgFlag) {
      return;
    }
    const x = ev.changedTouches[0].clientX;
    const y = ev.changedTouches[0].clientY;
    const list = this.data.elements
    let data = this.data.fileList
    for (var j = 0; j < list.length; j++) {
      const item = list[j]
      if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
        if (Math.abs(x - item.left) >= Math.abs(x - item.right)) {
          var endIndex = item.dataset.idx + 1
        } else {
          var endIndex = (item.dataset.idx - 1) >= 0 ? item.dataset.idx : 0
        }
        const beginIndex = this.data.beginIndex;
        // 显示路径换位置
        this.data.fileList.splice(beginIndex, 1);
        this.data.fileList.splice(endIndex, 0, this.data.choiceFile);
        // 设置
        this.setData({
          fileList: this.data.fileList
        });
      }
    }
    this.setData({
      hidden: true,
      moveImgFlag: false
    });
  },
})