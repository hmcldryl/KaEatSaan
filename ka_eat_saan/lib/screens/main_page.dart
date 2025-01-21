import 'package:flutter/material.dart';
import '../widgets/spin_button.dart';
import '../widgets/wheel.dart';

class KaEatSaanHomePage extends StatefulWidget {
  const KaEatSaanHomePage({super.key, required this.title});

  final String title;

  @override
  _KaEatSaanHomePageState createState() => _KaEatSaanHomePageState();
}

class _KaEatSaanHomePageState extends State<KaEatSaanHomePage> {
  final List<String> _restaurants = [
    'Jollibee',
    'Chowking',
    'McDonald\'s',
    'King Noah Eatery',
    'Carlos Eatery',
    'Kuya A\'s Karen-deria',
    'EBE',
    'Mang Inasal',
  ];

  String _selectedRestaurant = '';

  void _spinWheel() {
    _wheelKey.currentState?.spin();
  }

  final GlobalKey<WheelState> _wheelKey =
  GlobalKey<WheelState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Colors.deepOrange,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            // Wheel
            Wheel(
              key: _wheelKey,
              items: _restaurants,
              width: 300,
              height: 300,
              onSpinComplete: (selected) {
                setState(() {
                  _selectedRestaurant = selected;
                });
              },
            ),

            const SizedBox(height: 30),

            // Spin Button
            SpinButton(
              onPressed: _spinWheel,
              text: 'Saan Tayo Kain?',
            ),

            const SizedBox(height: 20),

            // Display selected restaurant
            if (_selectedRestaurant.isNotEmpty)
              Text(
                'Selected: $_selectedRestaurant',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.deepOrange,
                ),
              ),
          ],
        ),
      ),
    );
  }
}