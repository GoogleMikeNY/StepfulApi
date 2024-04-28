import moment from 'moment';

export const formatDate = (d) => {
  const dateObject = new Date(d);

  return moment(dateObject).format('MMMM Do YYYY, h:mm:ss a');
};

export const addTwoHoursToStart = (startTimeSlot) => {
  const dateObject = new Date(startTimeSlot);

  return moment(dateObject).add(2, 'hour').toDate();
};
