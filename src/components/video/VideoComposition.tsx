import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame } from 'remotion';

interface VideoCompositionProps {
  images: string[];
  audio: string;
  duration: number;
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ images, audio, duration }) => {
  const frame = useCurrentFrame();
  const imagesPerSlide = Math.floor(duration * 30 / images.length); // 30fps

  return (
    <AbsoluteFill>
      {images.map((image, index) => {
        const start = index * imagesPerSlide;
        return (
          <Sequence from={start} durationInFrames={imagesPerSlide} key={index}>
            <AbsoluteFill style={{ backgroundColor: 'white' }}>
              <Img
                src={image}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: interpolate(
                    frame - start,
                    [0, 5, imagesPerSlide - 5, imagesPerSlide],
                    [0, 1, 1, 0]
                  ),
                }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Audio src={audio} />
    </AbsoluteFill>
  );
};