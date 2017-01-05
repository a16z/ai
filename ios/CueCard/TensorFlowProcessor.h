//
//  TensorFlowProcessor.h
//  CueCard
//
//  Created by diego @ webelectric
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>


@interface TensorFlowProcessor : NSObject {

}

- (void)prepareWithLabelsFile:(NSString* _Nonnull)labelsFilename andGraphFile:(NSString* _Nonnull)graphFilename;
- (NSDictionary* _Nullable)processFrame:(CVPixelBufferRef _Nonnull)pixelBuffer;

@end
