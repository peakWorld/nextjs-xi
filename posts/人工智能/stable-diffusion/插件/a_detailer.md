使用识别模型来检测区域(人脸等)并自动创建修复蒙版

## 模型(ADetailer model)
![]('../assets/cj/ADetailer_1.png')
* Face_xxxx: 检测并重绘脸部
* Hand_xxxx: 检测并重绘手部
* Person_xxxx: 检测并重画整个人
* Mediapipe_face_xxxxx: 检测并重绘多张脸部
注: 8n模型速度更快, 但比8s模型小3倍; 如果8n模型未检测到人脸, 则用8s模型。

* 提示词(ADetailer prompt)
输入修复提示和否定提词, 可以在修复后再按提词重绘。

## 检测(Detection)
默认即能很好的工作。
![]('../assets/cj/ADetailer_2.png')

* Detection model confidence threshold(检测模型置信阈值)
生成图片时, 检测框顶部的数字框就是置信度分数；阈值是所需的最低置信度分数。
例如: 脸部, 0.8表示模型有80%的信心认为这是一张脸; 如果将其设置为0.9，则不会考虑置信度得分为0.8的人脸。
注: 如果在检测脸部时遇到问题，将其降低; 如果检测到太多，增加它。

* Mask min/max area ratio(蒙版最小/最大面积比)
检测到的蒙版允许的最小和最大面积。
例如: 如果将最小面积比设置为 0.1，则扩展程序将拒绝蒙版小于图像大小 10% 的检测。如果检测到不需要的小物体，请增加最小值。

## 蒙版处理(Mask Preprocessing)
默认即能很好的工作;
![]('../assets/cj/ADetailer_3.png')

在修复之前移动蒙版并调整其大小。
注: 在“设置”>“ADetailer”中启用“保存蒙版预览”以了解蒙版的更改方式。

* Mask x/y offset(蒙版 x/y 偏移)
沿 x/y 方向移动蒙版（以像素为单位）。

* Mask erosion (-) / dilation (+)(蒙版缩小/放大)
缩小/放大蒙版。

* Mask Merge mode(蒙版合并模式)
- None 修补每个面具。
- Merge 合并蒙版，然后修复。
- Merge and invert 修复未遮罩的区域。

## 修复(Inpainting)
默认即能很好的工作
![]('../assets/cj/ADetailer_4.png')

* Inpaint denoising strength(局部重绘幅度)
控制自动修复中使用的降噪强度。值增加, 做出更多改变；值减少, 减少改变。
