//
//  AppDelegate.swift
//  CueCardAI
//
//  Created by diego @ webelectric
//
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        let mainViewController = self.window?.rootViewController as! CueCardViewController        
        mainViewController.disableDetection()
    }
}

