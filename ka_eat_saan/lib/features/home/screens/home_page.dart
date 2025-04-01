import 'package:flutter/material.dart';
import '../widgets/spinning_wheel.dart';

class HomePage extends StatelessWidget {
  final List<String> restaurants = [
    'Carlos Eatery',
    'Kuya A\'s Karenderia',
    'McDonald\'s San Pedro',
    'Jollibee Junction 2',
    'King Noah Eatery',
    'Haim Chicken Robinson\'s',
    'Jollibee Robinson\'s',
    'Greenwich Robinson\'s',
  ];

  HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('KaEatSaan'),
      ),
      body: Center(
        child: SpinningWheel(
          restaurants: restaurants,
          onRestaurantSelected: (String selected) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(selected),
                duration: const Duration(seconds: 3),
              ),
            );
          },
        ),
      ),
    );
  }
}