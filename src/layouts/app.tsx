import Header from './Header';

export interface IAppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout(props: IAppLayoutProps) {
  const { children } = props;
  return (
    <>
      <Header />
      <main id="__main">{children}</main>
    </>
  );
}
