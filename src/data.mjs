// data.mjs
export const truongList = [
    { value: 'hust', label: 'Đại học Bách Khoa Hà Nội' },
    { value: 'neu', label: 'Đại học Kinh tế Quốc dân' },
    { value: 'uet', label: 'Đại học Công nghệ - ĐHQGHN' }
  ];
  
  export const nganhList = {
    hust: [
      { value: 'cntt', label: 'Công nghệ thông tin' },
      { value: 'dtvt', label: 'Điện tử viễn thông' }
    ],
    neu: [
      { value: 'ktqd', label: 'Kinh tế quốc dân' },
      { value: 'ktqt', label: 'Kinh tế quốc tế' }
    ],
    uet: [
      { value: 'cntt', label: 'Công nghệ thông tin' }
    ]
  };
  
  export const toHopList = {
    hust: {
      cntt: ['A00', 'A01'],
      dtvt: ['A00', 'A01', 'D07']
    },
    neu: {
      ktqd: ['A00', 'A01', 'D01'],
      ktqt: ['A01', 'D01']
    },
    uet: {
      cntt: ['A00', 'A01', 'D07']
    }
  };
  