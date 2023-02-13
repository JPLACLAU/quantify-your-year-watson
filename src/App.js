import React, { Component } from "react";
import Menu from "./components/Menu";
import Summary from "./components/Summary";
import Main from "./components/Main";
import ByDay from "./components/ByDay";
import { capitalize } from "./processors/formats";
import { getColorForTwoDirection, getRandomColor } from "./processors/colors";
import { getVisDimensions } from "./processors/dimensions";
import { getConvertedData } from "./processors/analysis";

import { Icon } from "react-fa";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      isScrolled: false,
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.setState({ isScrolled: scrollTop > 180 });
  }

  toggleMenu(willClose) {
    this.setState({ menuOpen: !willClose || !this.state.menuOpen });
  }

  render() {
    // get data id from url
    const dataId = this.props.params.dataId || "jpl-coding-2023";
    const setting = require(`./settings/${dataId}.json`);
    let data = require(`./data/${dataId}.json`);
    let {
      author,
      topic,
      year,
      color,
      abbr,
      alt_unit,
      conversion,
      decimal,
      hasNegative,
      isReverse,
    } = setting;
    // if alternaitve unit exists
    if (alt_unit != null) {
      data = getConvertedData(data, conversion, decimal);
    }
    if (hasNegative) {
      color = getColorForTwoDirection(isReverse);
    } else if (color === undefined && !hasNegative) {
      color = getRandomColor();
    }
    setting.color = color;
    if (abbr === undefined) {
      abbr = " " + setting.metric + "s";
      setting.abbr = abbr;
    }
    const dims = getVisDimensions(year);
    return (
      <div>
        <div className="menu">
          <Icon
            name="bars"
            size="2x"
            onClick={this.toggleMenu}
            className="hidden-md hidden-lg menu-icon"
          />
          <div
            onClick={this.toggleMenu}
            className="visible-md-block visible-lg-block menu-text"
          >
            Datasets{" "}
            <Icon
              name={`chevron-${this.state.menuOpen ? "up" : "down"}`}
              onClick={this.toggleMenu}
              className="menu-icon"
            />
          </div>
          <div
            className={
              this.state.menuOpen ? "menu-content show" : "menu-content hide"
            }
          >
            <Menu close={this.toggleMenu} url={dataId} />
          </div>
        </div>
        <div
          className={`${
            this.state.isScrolled ? "header-fixed" : "header"
          } ${color}`}
        >
          <div className="author">{capitalize(author)}'s</div>
          <div className="topic">
            {capitalize(topic)} in {year}
          </div>
        </div>
        <Summary {...setting} data={data} />
        <Main setting={setting} dims={dims} data={data} />
        <ByDay {...setting} dims={dims} data={data} />
        <div className="row">
          <div className={`col-xs-12 footer ${color}`}>
            <span className="link">Thanks for passing by</span>
            <span className="link">
              <a
                title="Github Repository"
                href="https://github.com/JPLACLAU/quantify-your-year-watson"
              >
                ReactJS app adapted by JPL
              </a>
            </span>

            <span className="link">
              <a title="Portfolio website" href="https://code.jplaclau.com">
                Don't forget to check my Portfolio website
              </a>
            </span>
            <span className="link">
              <a title="Portfolio website" href="https://code.jplaclau.com">
                <img src="/jplwebsite.ico" width="24" height="24" />
              </a>
            </span>

            {setting.dataSource && (
              <span className="link">
                Powered by
                <a
                  href={setting.dataSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {setting.dataSource.name}
                </a>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
