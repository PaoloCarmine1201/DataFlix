import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function AnimatedMulti({ selectedGenres, onChange }) {
  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      value={selectedGenres}
      onChange={onChange}
    />
  );
}