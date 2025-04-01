import 'package:flutter/material.dart';
import 'package:flutter_fortune_wheel/flutter_fortune_wheel.dart';
import 'dart:async';

import 'package:ka_eat_saan/features/home/widgets/spin_button.dart';

class SpinningWheel extends StatefulWidget {
  final List<String> restaurants;
  final Function(String) onRestaurantSelected;

  const SpinningWheel({
    super.key,
    required this.restaurants,
    required this.onRestaurantSelected,
  });

  @override
  State<SpinningWheel> createState() => _SpinningWheelState();
}

class _SpinningWheelState extends State<SpinningWheel> {
  final StreamController<int> _controller = StreamController<int>();
  int selectedValue = 0;

  @override
  void dispose() {
    _controller.close();
    super.dispose();
  }

  List<Color> get wheelColors => [
    Colors.red,
    Colors.blue,
    Colors.green,
    Colors.orange,
    Colors.purple,
    Colors.teal,
    Colors.pink,
    Colors.indigo,
  ];

  List<FortuneItem> _getFortuneItems() {
    return List.generate(
      widget.restaurants.length,
          (index) => FortuneItem(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            widget.restaurants[index],
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
        ),
        style: FortuneItemStyle(
          color: wheelColors[index % wheelColors.length],
          borderColor: Colors.white,
          borderWidth: 2,
        ),
      ),
    );
  }

  void _spinWheel() {
    setState(() {
      selectedValue = Fortune.randomInt(0, widget.restaurants.length);
      _controller.add(selectedValue);

      Future.delayed(
        const Duration(milliseconds: 5000),
            () => widget.onRestaurantSelected(widget.restaurants[selectedValue]),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: SizedBox(
            height: 300,
            child: FortuneWheel(
              selected: _controller.stream,
              physics: CircularPanPhysics(
                duration: const Duration(seconds: 1),
                curve: Curves.decelerate,
              ),
              onFling: _spinWheel,
              items: _getFortuneItems(),
              indicators: const <FortuneIndicator>[
                FortuneIndicator(
                  alignment: Alignment.topCenter,
                  child: TriangleIndicator(
                    color: Colors.amber,
                    width: 30,
                    height: 30,
                    elevation: 8,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),
        SpinButton(
          size: 120.0,
          color: Colors.red,
          text: 'SPIN',
          onPressed: () {
            _spinWheel();
          },
        ),
      ],
    );
  }
}