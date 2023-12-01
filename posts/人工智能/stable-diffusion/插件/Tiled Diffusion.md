## Tiled Diffusion
类似于高清修复, 对图片进行重绘的方式来放大图片尺寸; 利用分区块的方式重绘算图。
特别点是每个区块拼接的方式`Tile Overlap`, 让每个区块部分重叠融合、减少格状的边缘痕迹。
![]('../assets/cj/TiledD_1.webp')

### 相关功能
![]('../assets/cj/TiledD_2.webp')

* Keep input image size
勾选让上方设置的长宽失效, 以原图的长宽尺寸为基准进行重绘放大。

* Method
- MultiDiffusion适合用在重绘(高清修复)
- Mixture of Diffusers适合放大
其实效果差不多。

* Laten tile width/height
设置每个区块的大小。数值越大、一张图分块越少, 则速度越快、占用内存越大。推荐使用128

* Laten tile overlap
指区块与区块重叠面积大小, 数值越大、接缝越少，但速度越慢。
- 使用MultiDiffusion时 推荐设置32或48
- 使用Mixture of Diffusers时 推荐设置16或32。

* Laten tile batch size
指一次算图处理的区块数量, 数量越多、速度越快、占用内存越大。

* Upscaler
放大算法

* Scale Factor
放大倍数

* Noise Inversion
在生图时进行噪声反推，让新生成的图像与原图保持更高度的一致性; 如果生成的图感觉比较模糊, 尝试提高Inversion steps、降低Renoise strength。

* Region Prompt Control
用来对分区进行提示词设定。

## Tiled VAE
有效降低GPU的消耗。推荐和Tiled Diffusion一起使用; 单独使用, 可提升显卡算力。

根据每台电脑显卡性能, 自动预设参考值。

### 相关功能
![]('../assets/cj/TiledD_3.webp')

* Encoder & Decoder Tile Size
爆显存时, 再把预设置向下调整(在不爆显存的前提下, 数值越高越好)。

* Fast Encoder Color Fix
勾选Fast Encoder才会显示。
- 如果发现成像的颜色变调时, 才够选该选项。
- 推荐不勾选 Fast Encoder。