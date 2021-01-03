import React, { Component } from 'react';
import { capitalize, pluralize } from './../processors/formats';
import { getColorForTwoDirection } from './../processors/colors';

class Max extends Component {
  render() {
    let { unit, calendar, author, type, color, metric, hasNegative, isReverse } = this.props;
    const max = calendar.max[unit];
    const maxActiveList = max.list.map((item, i) => {
      let display = item;
      const count = max.list.length;
      // when there are only two items, space after the first.
      if (i === 0 && count === 2) {
        display += ' ';
        // Oxford comma
      } else if (i >= 0 && i < count - 1) {
        display += ', ';
      }
      // before the last item
      if (i >= 0 && i === count - 2) {
        display += 'and ';
      }
      let tail = '.';
      if (i === count - 1 && count > 5) {
        tail = ` (total ${count}).`
      }
      return (<span key={i}>{display}{i === count - 1 ? tail : ''}</span>);
    });
    const conj = { day: 'on', week: 'during', month: 'in' };
    if (hasNegative) {
      color = getColorForTwoDirection(max.val < 0 && isReverse || !isReverse && max.val >= 0);
    }
    return (
      <div className={`col-xs-12 max ${color}`} >
      { capitalize(author) }'s record {type} in a {unit} is
    { ` ` } <i>{pluralize(max.val, metric)}</i>:
    { ` ` } achieved { conj[unit] } <i>{maxActiveList}</i>
      </div >
    );
  }
}

export default Max;
