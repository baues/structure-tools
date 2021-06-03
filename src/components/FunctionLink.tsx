
import React from 'react';
import Link from 'next/link';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: 'inherit',
      textDecoration: 'none',
    },
  }),
);

type AnchorProps = React.HTMLProps<HTMLAnchorElement>;

// eslint-disable-next-line react/prop-types
const Child = React.forwardRef<HTMLAnchorElement, AnchorProps>(({ onClick, target, href, children }, ref) => {
  const classes = useStyles();

  return (
    <a className={classes.link} href={href} onClick={onClick} ref={ref} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
      {children}
    </a>
  );
});

type Props = React.ComponentProps<typeof Link> & {
  target?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

export default function FunctionLink({ children, href, onClick, target, ...others }: Props) {
  return (
    <Link href={href} passHref {...others}>
      <Child onClick={onClick} target={target}>{children}</Child>
    </Link>
  );
}
