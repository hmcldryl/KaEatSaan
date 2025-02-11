import 'package:flutter/material.dart';
import 'package:ka_eat_saan/features/home/screens/home_page.dart';

void main() {
  runApp(const KaEatSaanApp());
}

class KaEatSaanApp extends StatelessWidget {
  const KaEatSaanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Restaurant Spinner',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        // Add custom theme settings
        scaffoldBackgroundColor: Colors.grey[100],
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.blue,
          elevation: 0,
          centerTitle: true,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(
              horizontal: 32,
              vertical: 16,
            ),
            textStyle: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
      home: HomePage(),
      debugShowCheckedModeBanner: false, // Removes the debug banner
    );
  }
}