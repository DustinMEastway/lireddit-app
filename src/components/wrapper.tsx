import { Box } from '@chakra-ui/layout';

export type WrapperPropsSize = 'small' | 'medium';

export interface WrapperProps {
  size?: WrapperPropsSize;
};

export const Wrapper: React.FC<WrapperProps> = ({ children, size }) => {
  return <Box
    marginX="auto"
    marginY="1rem"
    maxWidth={`${wrapperSizeToPixels(size)}px`}
    width="100%"
  >
    {children}
  </Box>;
};

export function wrapperSizeToPixels(size: WrapperPropsSize = 'medium'): number {
  switch (size) {
    case 'medium':
      return 800;
    case 'small':
      return 400;
    default:
      const neverSize: never = size;
      throw new Error(`Invalid size '${neverSize}' provided to Wrapper.sizeToPixels`);
  }
};
