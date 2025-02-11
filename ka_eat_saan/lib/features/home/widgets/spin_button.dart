import 'package:flutter/material.dart';

class SpinButton extends StatelessWidget {
  final VoidCallback onPressed;
  final String text;

  const SpinButton({
    Key? key,
    required this.onPressed,
    this.text = 'Spin',
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: Colors.deepOrange,
        padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
        textStyle: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      child: Text(text),
    );
  }
}