# 图像精准控制
在ControlNet出现之前，使用AI生成图片，永远的不知道AI能给我们生成什么，就像抽卡一样难受。
在ControlNet出现之后，就能通过模型精准的控制图像生成，比如：上传线稿让AI帮忙填色渲染，控制人物的姿态、图片生成线稿等等。
注: 通过💥图标来预览注解图。

## 生图流程
* 以OpenPos为例
使用OpenPose从输入图像中提取关键点，并将其保存为包含关键点位置的控制图。然后将其与文本提示一起作为额外条件馈送到稳定扩散。图像是根据这两个条件生成的。
![]('../assets/cj/CNet_1.png')
> 检测人体关键点。图像生成更加自由，但遵循原始姿势。

* 以Canny例
使用Canny边缘检测器检测其轮廓。然后将包含检测到的边缘的图像保存为控制图。它被输入ControlNet模型作为文本提示的额外条件。
![]('../assets/cj/CNet_2.png')
> 可提取拍摄对象和背景的边缘, 更忠实地描述场景。

## 参考链接
[art文章](https://stable-diffusion-art.com/controlnet/)

# 控制类型(Control Type)

## Canny(边缘检测)
一种常用的线稿提取方式，该模型能够很好的识别出图像内各对象的边缘轮廓。
* Canny Low/High Threshold(低阈值/高阈值)
数值越低线条越复杂，数值越高线条越简单。

注: 以线稿为主体结构, 提词在该主体上进行修饰。


## SoftEdge(软边缘检测)
相较于Canny，SoftEdge能够保留更多细节。

预处理器按结果质量排序：SoftEdge_HED > SoftEdge_PIDI > SoftEdge_HED_safe > SoftEdge_PIDI_safe
注: 带safe的预处理器可以防止生成的图像带有不良内容。


## Lineart(精细线稿)
相较于Canny，Lineart提取的线稿更加精细，细节更加丰富。

* lineart_anime(动漫线条艺术)
动漫风格的线条
* lineart_anime_denoise(线条艺术动漫降噪)
细节较少的动漫风格线条。
* lineart_realistic(线条艺术写实)
写实风格的线条。
* lineart_coarse(粗线条)
写实风格的线条，粗重。


## Scribble(涂鸦/草图)
预处理器将图片变成涂鸦，就像手绘的一样。

* scribble_hed
整体嵌套边缘检测 (Hed) 一种边缘检测器。擅长生成像真人一样的轮廓，适合对图像进行重新着色和重新设计样式。
* scribble_pidinet
像素差异网络 (Pidinet) 检测曲线和直线边缘。
- 其结果与 HED 类似，但通常会产生更清晰的线条和更少的细节。
* scribble_xdog
扩展高斯差分 (XDoG) 一种边缘检测方法技术。
- XDoG Threshold 值越大, 生成的线条越少。

## MLSD(直线提取)
一种直线检测器。对于提取具有直边的轮廓非常有用，例如室内设计、建筑物、街景、相框和纸张边缘。
注: 曲线将被忽略.


## Segmentation(语义分割)
分割预处理器标记参考图像中的对象类型；
标注画面中的不同区块颜色和结构（不同颜色代表不同类型对象），从而控制画面的构图和内容。
[ufade20k|ofade20k](https://docs.qq.com/sheet/DYmtkWG5taWxhVkx2?tab=BB08J2)

* ufade20k
准确地标记了所有内容
* ofade20k
噪点较多，但不会影响最终图像
* ofcoco


## Depth(深度)
从参考图像中猜测深度信息。

* depth_midas
经典的深度估计器。
* depth_leres
更多细节，倾向于渲染背景。
* depth_leres++
更多细节
* depth_zoe
细节程度介于 Midas 和 Leres 之间


## NormalMap(法线贴图)
指定每个像素所在表面的方向。图像像素表面面向的方向，而不是颜色值。

* normal_bae
倾向于在背景和前景中渲染细节。
* normal_midas
非常适合将主体与背景隔离.


## Shuffle(随机洗牌)
随机搅动输入图像，将受到种子值的影响。
- 生成图片的配色方案大致遵循参考图像


## OpenPose(姿态)
可检测人体关键点，例如头、肩膀、手的位置等。它对于复制人体姿势非常有用，而无需复制服装、发型和背景等其他细节。
* OpenPose
基本的OpenPose预处理器，可检测眼睛、鼻子、眼睛、颈部、肩膀、肘部、手腕、膝盖和脚踝的位置
* OpenPose_face
执行OpenPose预处理器执行的所有操作，还会检测面部细节; 对于复制面部表情很有用.
* OpenPose_faceonly
仅检测面部而不检测其他关键点; 身体不受约束。
* OpenPose_hand
执行OpenPose预处理器执行的所有操作，以及手和手指。
* OpenPose_full
执行OpenPose_face和OpenPose_hand所做的一切。
* dw_openpose_full
与OpenPose_full相同的任务，但做得更好。 ✅


## Tile/Blur (分块/模糊)
### tile_resample
用于向图像添加细节。通常与放大器一起使用，同时放大图像。
1. 修复(增加)图片细节
让一张原本解析度较低的图片放大到高解析度, 并且在此过程中能保持图片的细节和清晰度(让图片更逼真)。
注意: 该模型用来忽略图像中的细节并生成新的细节、而不是增加解析度; 可以用来删除不良细节, 即使图像中的良好细节、也可以进行替换。例如删除由调整图像大小引起的模糊;
2. 忽略全局提词(global prompts)
绘图时以图片内的物体为主。即使提词中有指示, 只要图片里没有这样物体、题词就不起效。

* Down Sampling Rate
值越大、则注解图的尺寸越小, 那么生成时需要补充的像素就越多(生成图中的填补的细节越多)。


## 局部重绘(Inpaint)
在修复中使用高降噪强度来生成较大的变化，而不会牺牲整个图片的一致性。
注: 结合Img2img页面的Inpaint选项卡一起使用。

* inpaint_global_harmonious
提高全局一致性并允许使用高去噪强度。
* inpaint_only
不会改变未遮罩的区域。
* inpaint_only+lama
用lama模型处理图像。往往会产生更干净的结果，并且有利于**物体去除**。


## IP-Adapter
> Image Prompt adapter(图像提示适配器)
允许使用图像作为提示。

* ip-adapter_sd15
* ip-adapter_sd15_plus
更细粒度的提示，生成图片和原画更接近。可以减少控制权重来调低它。


## Reference (参考)
生成与参考图像类似的图像, 模型和提词仍然会影响图像。

* reference_only
以图像为参考来指导扩散, 不需要任何控制模型.
[Major](https://github.com/Mikubill/sd-webui-controlnet/discussions/1236)
* reference_adain
* reference_adain+attn
reference_only和reference_adain的组合


## T2I-Adapter
### t2ia_color_grid(彩色网格 T2i 适配器)
将参考图像缩小64倍，然后将其扩展回原始大小。最终效果是局部平均颜色的网格状斑块。

* Preprocessor Resolution
预处理器分辨率 值越大, 注解图网格状斑块越多。

### t2ia_style_clipvision(剪辑视觉式 T2I 适配器)
将参考图像转换为 CLIP 视觉嵌入；这种嵌入包含有关图像内容和风格的丰富信息。


## Recolor (重上色)


## Revision


## InstructP2P


# Resize mode(调整大小模式)
控制当输入图像(控制图)的大小与要生成的图像(画布)的大小不同时要执行的操作。如果这些选项具有相同的宽高比，则无需担心它们。
举例: 控制图是纵向、生成图是横向的可以查看效果

* Just Resize(仅调整大小)
缩放控制图的宽度和高度以适合图像画布，这将改变控制图的纵横比。
* Crop and Resize(裁剪后缩放)
裁剪控制图，使其与画布大小相同。
* Resize and Fill(缩放后填充空白)
使用空值扩展控制图，使其与图像画布的大小相同。

