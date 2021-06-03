import React from 'react';
import { IconButton } from '@material-ui/core';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { LinkProps } from 'next/link';
import Link from './FunctionLink';

type LinkIconButtonProps = Omit<IconButtonProps, 'href'> &
  Omit<LinkProps, 'children' | 'passHref'> & {
    className?: string;
    target?: string;
  };

// eslint-disable-next-line react/prop-types
const LinkIconButton: React.FC<LinkIconButtonProps> = ({ href, as, target, prefetch, shallow, scroll, replace, className, children, ...otherProps }) => (
  <Link href={href} as={as} target={target} prefetch={prefetch} shallow={shallow} scroll={scroll} replace={replace} passHref>
    <IconButton className={className} {...otherProps}>
      {children}
    </IconButton>
  </Link>
);

export default LinkIconButton;
