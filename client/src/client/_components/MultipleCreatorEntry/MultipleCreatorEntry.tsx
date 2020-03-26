import React from 'react';
import ReactHover from 'react-hover';
import { Entry } from '../../_styled_components/displayPage';
import Link from '../../_styled_components/link';
import { getFullName } from '../../_helpers/getFullName';
import { Creator } from '../../../lib/interfaces';
import { MongoId, WindowSizeObject } from '../../_interfaces';
import { EntryModal } from '../../_styled_components/entryModal';
import { useWindowSize } from '../../_hooks';

interface MCEProps {
    creators: (Creator & MongoId)[] | undefined;
}

export const MultipleCreatorEntry: React.FunctionComponent<MCEProps> = ({
    creators
}) => {
    const options = {
        followCursor: false,
        shiftX: 20,
        shiftY: 0
    };
    const size: WindowSizeObject = useWindowSize();
    const minDesktopWidth = 768;
    const isMobileLayout = size.width && size.width < minDesktopWidth;

    return creators && creators.length > 0 ? (
        creators && creators.length < 2 ? (
            <Entry>
                <Link
                    key={creators[0]._id}
                    to={`../creators/${creators[0]._id}`}
                >
                    {getFullName(creators[0])}
                </Link>
            </Entry>
        ) : isMobileLayout ? (
            <Entry>
                {creators.map(creator => (
                    <Link key={creator._id} to={`../creators/${creator._id}`}>
                        {getFullName(creator)}
                    </Link>
                ))}
            </Entry>
        ) : (
            <ReactHover options={options}>
                <ReactHover.Trigger type="trigger">
                    <Entry>
                        <Link
                            key={creators[0]._id}
                            to={`../creators/${creators[0]._id}`}
                        >
                            {`${getFullName(creators[0])} & ...`}
                        </Link>
                    </Entry>
                </ReactHover.Trigger>
                <ReactHover.Hover type="hover">
                    <EntryModal>
                        {creators.slice(1).map(creator => (
                            <Link
                                key={creator._id}
                                to={`../creators/${creator._id}`}
                            >
                                {`${getFullName(creator)}`}
                            </Link>
                        ))}
                    </EntryModal>
                </ReactHover.Hover>
            </ReactHover>
        )
    ) : (
        <div>null option</div>
    );
};
