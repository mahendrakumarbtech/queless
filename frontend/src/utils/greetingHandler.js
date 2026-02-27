/**
 * Returns greeting message in Sneat style: "Hello {name}, Good Evening 🌙"
 */
const getGreetingMessage = (name = 'Admin') => {
  const hour = new Date().getHours();
  let greeting = 'Good Evening 🌙';
  if (hour >= 5 && hour < 12) greeting = 'Good Morning 😎';
  else if (hour >= 12 && hour < 18) greeting = 'Good Afternoon 🌤️';
  return `Hello ${name}. ${greeting}`;
};

export default getGreetingMessage;
