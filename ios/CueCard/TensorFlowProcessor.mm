// Some Code Sections Copyright 2015 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
//  TensorFlowProcessor.mm
//  CueCard
//
//  Created by diego @ webelectric
//
//

#import "TensorFlowProcessor.h"

#import <AssertMacros.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <CoreImage/CoreImage.h>
#import <ImageIO/ImageIO.h>

#include <sys/time.h>
#include <memory>

#include "tensorflow_utils.h"
#include "tensorflow/core/public/session.h"
#include "tensorflow/core/util/memmapped_file_system.h"

const int wanted_input_width = 299;
const int wanted_input_height = 299;
const int wanted_input_channels = 3;
const float input_mean = 128.0f;
const float input_std = 128.0f;
const std::string input_layer_name = "Mul";
const std::string output_layer_name = "final_result";
const bool model_uses_memory_mapping = false;

@interface TensorFlowProcessor (Private) {

}

@end

@implementation TensorFlowProcessor

std::unique_ptr<tensorflow::Session> tf_session;
std::unique_ptr<tensorflow::MemmappedEnv> tf_memmapped_env;
std::vector<std::string> labels;
NSMutableDictionary *oldPredictionValues;
BOOL isConfigured = NO;

- (void)prepareWithLabelsFile:(NSString*)labelsFilename andGraphFile:(NSString*)graphFilename {
    tensorflow::Status load_status;
    
    NSString *graphFname = [graphFilename stringByDeletingPathExtension];
    NSString *graphFextension = [graphFilename pathExtension];

    if (model_uses_memory_mapping) {
        load_status = LoadMemoryMappedModel(
                                            graphFname, graphFextension, &tf_session, &tf_memmapped_env);
    } else {
        load_status = LoadModel(graphFname, graphFextension, &tf_session);
    }
    if (!load_status.ok()) {
        LOG(FATAL) << "Couldn't load model: " << load_status;
    }
    
    NSString *labelsFname = [labelsFilename stringByDeletingPathExtension];
    NSString *labelsFextension = [labelsFilename pathExtension];
    
    tensorflow::Status labels_status =
    LoadLabels(labelsFname, labelsFextension, &labels);
//    LoadLabels(labels_file_name, labels_file_type, &labels);
    oldPredictionValues = [[NSMutableDictionary alloc] init];
    
    isConfigured = YES;

}

- (NSDictionary* _Nullable)processFrame:(CVPixelBufferRef)pixelBuffer {
    
    if (!isConfigured) {
        return nil;
    }
    
    assert(pixelBuffer != NULL);
    
    
    NSMutableDictionary *result = nil;
    
    //    UIImage* img = [self imgFromCVPixelBuffer:pixelBuffer];
    
    OSType sourcePixelFormat = CVPixelBufferGetPixelFormatType(pixelBuffer);
    int doReverseChannels;
    if (kCVPixelFormatType_32ARGB == sourcePixelFormat) {
        doReverseChannels = 1;
    } else if (kCVPixelFormatType_32BGRA == sourcePixelFormat) {
        doReverseChannels = 0;
    } else {
        assert(false);  // Unknown source format
    }
    
    const int sourceRowBytes = (int)CVPixelBufferGetBytesPerRow(pixelBuffer);
    const int image_width = (int)CVPixelBufferGetWidth(pixelBuffer);
    const int fullHeight = (int)CVPixelBufferGetHeight(pixelBuffer);
    CVPixelBufferLockBaseAddress(pixelBuffer, kCVPixelBufferLock_ReadOnly);
    unsigned char *sourceBaseAddr =
    (unsigned char *)(CVPixelBufferGetBaseAddress(pixelBuffer));
    int image_height;
    unsigned char *sourceStartAddr;
    if (fullHeight <= image_width) {
        image_height = fullHeight;
        sourceStartAddr = sourceBaseAddr;
    } else {
        image_height = image_width;
        const int marginY = ((fullHeight - image_width) / 2);
        sourceStartAddr = (sourceBaseAddr + (marginY * sourceRowBytes));
    }
    const int image_channels = 4;
    
    
//    NSLog(@"Img w = %d h= %d", image_width, fullHeight);
    
    assert(image_channels >= wanted_input_channels);
    tensorflow::Tensor image_tensor(
                                    tensorflow::DT_FLOAT,
                                    tensorflow::TensorShape(
                                                            {1, wanted_input_height, wanted_input_width, wanted_input_channels}));
    auto image_tensor_mapped = image_tensor.tensor<float, 4>();
    tensorflow::uint8 *in = sourceStartAddr;
    float *out = image_tensor_mapped.data();
    for (int y = 0; y < wanted_input_height; ++y) {
        float *out_row = out + (y * wanted_input_width * wanted_input_channels);
        for (int x = 0; x < wanted_input_width; ++x) {
            const int in_x = (y * image_width) / wanted_input_width;
            const int in_y = (x * image_height) / wanted_input_height;
            tensorflow::uint8 *in_pixel =
            in + (in_y * image_width * image_channels) + (in_x * image_channels);
            float *out_pixel = out_row + (x * wanted_input_channels);
            for (int c = 0; c < wanted_input_channels; ++c) {
                out_pixel[c] = (in_pixel[c] - input_mean) / input_std;
            }
        }
    }
    
    if (tf_session.get()) {
        std::vector<tensorflow::Tensor> outputs;
        tensorflow::Status run_status = tf_session->Run(
                                                        {{input_layer_name, image_tensor}}, {output_layer_name}, {}, &outputs);
        if (!run_status.ok()) {
            LOG(ERROR) << "Running model failed:" << run_status;
        } else {
            tensorflow::Tensor *output = &outputs[0];
            auto predictions = output->flat<float>();
            CVPixelBufferUnlockBaseAddress(pixelBuffer, kCVPixelBufferLock_ReadOnly);
//            UIImage* img = [self imgFromCVPixelBuffer:pixelBuffer];
            
            NSMutableDictionary *newValues = [NSMutableDictionary dictionary];
            for (int index = 0; index < predictions.size(); index += 1) {
                const float predictionValue = predictions(index);
                if (predictionValue > 0.05f) {
                    std::string label = labels[index % predictions.size()];
                    NSString *labelObject = [NSString stringWithCString:label.c_str()];
                    NSNumber *valueObject = [NSNumber numberWithFloat:predictionValue];
                    [newValues setObject:valueObject forKey:labelObject];
                }
            }
            
            
            const float decayValue = 0.75f;
            //
            const float updateValue = 0.25f;
            const float minimumThreshold = 0.01f;
            
            
            NSMutableDictionary *decayedPredictionValues =
            [[NSMutableDictionary alloc] init];
            for (NSString *label in oldPredictionValues) {
                NSNumber *oldPredictionValueObject =
                [oldPredictionValues objectForKey:label];
                const float oldPredictionValue = [oldPredictionValueObject floatValue];
                const float decayedPredictionValue = (oldPredictionValue * decayValue);
                if (decayedPredictionValue > minimumThreshold) {
                    NSNumber *decayedPredictionValueObject =
                    [NSNumber numberWithFloat:decayedPredictionValue];
                    [decayedPredictionValues setObject:decayedPredictionValueObject
                                                forKey:label];
                }
            }
            
            oldPredictionValues = decayedPredictionValues;
            
            for (NSString *label in newValues) {
                NSNumber *newPredictionValueObject = [newValues objectForKey:label];
                NSNumber *oldPredictionValueObject =
                [oldPredictionValues objectForKey:label];
                if (!oldPredictionValueObject) {
                    oldPredictionValueObject = [NSNumber numberWithFloat:0.0f];
                }
                const float newPredictionValue = [newPredictionValueObject floatValue];
                const float oldPredictionValue = [oldPredictionValueObject floatValue];
                const float updatedPredictionValue =
                (oldPredictionValue + (newPredictionValue * updateValue));
                NSNumber *updatedPredictionValueObject =
                [NSNumber numberWithFloat:updatedPredictionValue];
                [oldPredictionValues setObject:updatedPredictionValueObject forKey:label];
            }
            NSArray *candidateLabels = [NSMutableArray array];
            for (NSString *label in oldPredictionValues) {
                NSNumber *oldPredictionValueObject =
                [oldPredictionValues objectForKey:label];
                const float oldPredictionValue = [oldPredictionValueObject floatValue];
                if (oldPredictionValue > 0.05f) {
                    NSDictionary *entry = @{
                                            @"label" : label,
                                            @"value" : oldPredictionValueObject
                                            };
                    candidateLabels = [candidateLabels arrayByAddingObject:entry];
                }
            }
            NSSortDescriptor *sort =
            [NSSortDescriptor sortDescriptorWithKey:@"value" ascending:NO];
            NSArray *sortedLabels = [candidateLabels
                                     sortedArrayUsingDescriptors:[NSArray arrayWithObject:sort]];
            
            result = [NSMutableDictionary new];
            for (NSDictionary *entry in sortedLabels) {
                NSString *label = [entry objectForKey:@"label"];
                NSNumber *valueObject = [entry objectForKey:@"value"];
                [result setObject:valueObject forKey:label];
            }
            
//            result = sortedLabels;
//            dispatch_async(dispatch_get_main_queue(), ^(void) {
//                NSLog(@"Prediction: %@", newValues);
//                //                [self setPredictionValues:newValues image:img];
//            });
        }
    }
    else {
        CVPixelBufferUnlockBaseAddress(pixelBuffer, kCVPixelBufferLock_ReadOnly);
    }
    
    return result;

}
//
//- (void)setPredictionValues:(NSDictionary *)newValues image:(UIImage*)img {
//    const float decayValue = 0.75f;
//    //
//    const float updateValue = 0.25f;
//    const float minimumThreshold = 0.01f;
//    
//    
//    NSMutableDictionary *decayedPredictionValues =
//    [[NSMutableDictionary alloc] init];
//    for (NSString *label in oldPredictionValues) {
//        NSNumber *oldPredictionValueObject =
//        [oldPredictionValues objectForKey:label];
//        const float oldPredictionValue = [oldPredictionValueObject floatValue];
//        const float decayedPredictionValue = (oldPredictionValue * decayValue);
//        if (decayedPredictionValue > minimumThreshold) {
//            NSNumber *decayedPredictionValueObject =
//            [NSNumber numberWithFloat:decayedPredictionValue];
//            [decayedPredictionValues setObject:decayedPredictionValueObject
//                                        forKey:label];
//        }
//    }
//    [oldPredictionValues release];
//    oldPredictionValues = decayedPredictionValues;
//    
//    for (NSString *label in newValues) {
//        NSNumber *newPredictionValueObject = [newValues objectForKey:label];
//        NSNumber *oldPredictionValueObject =
//        [oldPredictionValues objectForKey:label];
//        if (!oldPredictionValueObject) {
//            oldPredictionValueObject = [NSNumber numberWithFloat:0.0f];
//        }
//        const float newPredictionValue = [newPredictionValueObject floatValue];
//        const float oldPredictionValue = [oldPredictionValueObject floatValue];
//        const float updatedPredictionValue =
//        (oldPredictionValue + (newPredictionValue * updateValue));
//        NSNumber *updatedPredictionValueObject =
//        [NSNumber numberWithFloat:updatedPredictionValue];
//        [oldPredictionValues setObject:updatedPredictionValueObject forKey:label];
//    }
//    NSArray *candidateLabels = [NSMutableArray array];
//    for (NSString *label in oldPredictionValues) {
//        NSNumber *oldPredictionValueObject =
//        [oldPredictionValues objectForKey:label];
//        const float oldPredictionValue = [oldPredictionValueObject floatValue];
//        if (oldPredictionValue > 0.05f) {
//            NSDictionary *entry = @{
//                                    @"label" : label,
//                                    @"value" : oldPredictionValueObject
//                                    };
//            candidateLabels = [candidateLabels arrayByAddingObject:entry];
//        }
//    }
//    NSSortDescriptor *sort =
//    [NSSortDescriptor sortDescriptorWithKey:@"value" ascending:NO];
//    NSArray *sortedLabels = [candidateLabels
//                             sortedArrayUsingDescriptors:[NSArray arrayWithObject:sort]];
//    
//    int labelCount = 0;
//    
//    NSString *resultLabel = @"no label";
//    BOOL displayLabel = false;
//    int cardPercentage = 0;
//    
//    for (NSDictionary *entry in sortedLabels) {
//        NSString *label = [entry objectForKey:@"label"];
//        NSNumber *valueObject = [entry objectForKey:@"value"];
//        const float value = [valueObject floatValue];
//        int valuePercentage = (int)roundf(value * 100.0f);
//        //        if (labelCount == 0) {
//        if (value > 0.6f) {
//            NSNumber *val = [newValues objectForKey:label];
//            const float val2 = [val floatValue];
//            int valuePercentage2 = (int)roundf(val2 * 100.0f);
//            resultLabel = [NSString stringWithFormat:@"%@ (%d%%) (%d%%)", label, valuePercentage, valuePercentage2];
//            displayLabel = true;
//            cardPercentage = valuePercentage;
//        }
//    }
//    
//    
//    if (displayLabel) {
//        const float originY =
//        (topMargin + ((labelHeight + labelMarginY) ));
//        
//        const float labelOriginX = 20;
//        
//        
//        [self addLabelLayerWithText:resultLabel
//                            originX:labelOriginX
//                            originY:originY
//                              width:labelWidth
//                             height:labelHeight
//                          alignment:kCAAlignmentLeft];
//    }
//}
//


@end
