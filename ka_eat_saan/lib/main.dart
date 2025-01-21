import 'package:flutter/material.dart';
import 'screens/main_page.dart';

void main() {
  runApp(const KaEatSaanApp());
}

class KaEatSaanApp extends StatelessWidget {
  const KaEatSaanApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KaEatSaan',
      theme: ThemeData(
        primarySwatch: Colors.deepOrange,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const KaEatSaanHomePage(title: 'KaEatSaan - Where to Eat?'),
    );
  }
}