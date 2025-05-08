import { jsx as _jsx } from "react/jsx-runtime";
import SongSearch from '../components/SongSearch';
export default function Home() {
    return (_jsx("div", { className: "home-container", children: _jsx("div", { className: "home-content", children: _jsx(SongSearch, {}) }) }));
}
