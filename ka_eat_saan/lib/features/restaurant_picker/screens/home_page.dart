import 'package:flutter/material.dart';
import '../widgets/spinning_wheel.dart';

class HomePage extends StatelessWidget {
  final List<String> restaurants = [
    'Pizza Place',
    'Burger Joint',
    'Sushi Bar',
    'Thai Food',
    'Mexican Grill',
    'Italian Restaurant',
    'Indian Cuisine',
    'Chinese Restaurant',
  ];

  HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Restaurant Spinner'),
      ),
      body: Center(
        child: SpinningWheel(
          restaurants: restaurants,
          onRestaurantSelected: (String selected) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Selected restaurant: $selected'),
                duration: const Duration(seconds: 2),
              ),
            );
          },
        ),
      ),
    );
  }
}