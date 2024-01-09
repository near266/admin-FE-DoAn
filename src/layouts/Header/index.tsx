import HtmlHeader from './components/HtmlHeader';
import { NavBar } from './components/NavBar';
import { SideBar } from './components/SideBar';

export interface IHeaderProps {
  data?: 'TODO:Change me';
}

const Header: React.FC = () => {
  return (
    <div id="__header">
      <HtmlHeader />
      <NavBar />
      <SideBar />
    </div>
  );
};
export default Header;
