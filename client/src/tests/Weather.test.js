import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from "axios";
import Weather from '../Weather';

//Test file for the Weather component

// Mock axios.post
jest.mock('axios');

describe('Weather component', () => {
  test('renders without crashing', () => {
    render(<Weather />);
    expect(screen.getByText('City:')).toBeInTheDocument();
  });

  test('form elements exist and can be interacted with', () => {
    render(<Weather />);
    const cityInput = screen.getByLabelText('City:');
    expect(cityInput).toBeInTheDocument();
    userEvent.type(cityInput, 'San Francisco');
    expect(cityInput.value).toBe('San Francisco');
  });

  test('fetches and displays weather data after form submission', async () => {
    // Mock axios.post response
    axios.post.mockResolvedValue({
      data: [
        {
          date: '2023-05-04',
          avgtemp_c: 20,
          totalprecip_mm: 0,
          maxwind_kph: 10,
          avghumidity: 50,
        },
      ],
    });

    // Render Weather component
    render(<Weather />);
    // Get city input
    const cityInput = screen.getByLabelText('City:');

    // Update the input value and wait for the update to finish
    userEvent.type(cityInput, 'San Francisco');
    await waitFor(() => expect(cityInput.value).toBe('San Francisco'));

    // Simulate form submission
    userEvent.click(screen.getByRole('button', { name: 'Display Data' }));

    // Wait for HTTP request to be made
    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // Check that HTTP request was made with correct data
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/weather', {
      city: 'San Francisco',
      days: 3,
    });

    // Check that weather data is displayed correctly
    expect(screen.getByText('San Francisco')).toBeInTheDocument();
    expect(screen.getByText('2023-05-04')).toBeInTheDocument();
    expect(screen.getByText('Average Temperature: 20°C')).toBeInTheDocument();
    expect(screen.getByText('Total Precipitation: 0 mm')).toBeInTheDocument();
    expect(screen.getByText('Max Wind Speed: 10 km/h')).toBeInTheDocument();
    expect(screen.getByText('Average Humidity: 50%')).toBeInTheDocument();
  });

  test('handles HTTP request error', async () => {
    // Mock axios.post to return an error
    const errorMessage = 'Error fetching weather data';
    axios.post.mockRejectedValue(new Error(errorMessage));

    // Render Weather component
    render(<Weather />);
    // Get city input
    const cityInput = screen.getByLabelText('City:');

    // Update the input value and wait for the update to finish
    userEvent.type(cityInput, 'San Francisco');
    await waitFor(() => expect(cityInput.value).toBe('San Francisco'));

    // Simulate form submission
    userEvent.click(screen.getByRole('button', { name: 'Display Data' }));

    // Wait for HTTP request to be made
    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // Check that error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
